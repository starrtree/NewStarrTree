"""Render exported Three scene geometry with native EGL, without a browser.
These are source-geometry references, not verified browser screenshots.
Requires Python packages: moderngl, numpy, Pillow.
Run npm run lab:export first. Custom GLSL runs after a GLSL 330 syntax conversion;
standard materials use reference lighting, not Three's full PBR implementation.
"""
from pathlib import Path
import json, re, math
import moderngl
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/assets/lab'; OUT.mkdir(parents=True,exist_ok=True)
PREVIEWS=ROOT/'docs/assets-lab/previews';PREVIEWS.mkdir(parents=True,exist_ok=True)
ctx=moderngl.create_standalone_context(backend='egl')
W=1100;H=1100
fbo=ctx.simple_framebuffer((W,H),components=4);fbo.use()
ctx.enable(moderngl.DEPTH_TEST|moderngl.BLEND)
ctx.blend_func=moderngl.SRC_ALPHA,moderngl.ONE_MINUS_SRC_ALPHA

VERT='''#version 330
in vec3 position;in vec3 normal;in vec3 color;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;uniform mat3 normalMatrix;out vec3 vN;out vec3 vP;out vec3 vC;
void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vP=mv.xyz;vC=color;gl_Position=projectionMatrix*mv;}
'''
FRAG='''#version 330
uniform vec3 uColor;uniform vec3 uEmissive;uniform float uMetalness;uniform float uRoughness;uniform float uOpacity;uniform float uVertexColors;in vec3 vN;in vec3 vP;in vec3 vC;out vec4 fragColor;
void main(){vec3 n=normalize(vN),v=normalize(-vP),a=normalize(vec3(2.,4.,5.)),b=normalize(vec3(-4.,1.,2.));
vec3 base=uColor*mix(vec3(1.),vC,uVertexColors);float ka=max(0.,dot(n,a)),kb=max(0.,dot(n,b));
vec3 c=base*(vec3(.24,.36,.29)+vec3(1.8,1.55,1.15)*ka+vec3(.54,.95,.82)*kb);
float rough=clamp(uRoughness,.09,.9),p=6.+(1.-rough)*90.;vec3 spec=mix(vec3(1.),base,uMetalness);
c+=spec*(pow(max(0.,dot(n,normalize(a+v))),p)*2.+pow(max(0.,dot(n,normalize(b+v))),p)*1.3)+uEmissive;
c=c/(c+vec3(1.));c=pow(c,vec3(1./2.2));fragColor=vec4(c,uOpacity);}
'''
standard=ctx.program(vertex_shader=VERT,fragment_shader=FRAG)
def translate(src,vertex):
 src=re.sub(r'precision\s+\w+\s+\w+\s*;','',src)
 src=src.replace('attribute ','in ').replace('varying ','out ' if vertex else 'in ')
 if vertex:
  declarations='in vec3 position;in vec3 normal;in vec2 uv;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;uniform mat3 normalMatrix;\n'
 else:
  declarations='out vec4 fragColor;\n';src=src.replace('gl_FragColor','fragColor')
 return '#version 330\n'+declarations+src
programs={}
def look_at(eye,target):
 eye=np.array(eye,dtype='f4');target=np.array(target,dtype='f4');z=eye-target;z/=np.linalg.norm(z);x=np.cross([0,1,0],z);x/=np.linalg.norm(x);y=np.cross(z,x)
 m=np.eye(4,dtype='f4');m[:3,:3]=[x,y,z];m[:3,3]=-m[:3,:3]@eye;return m

def perspective(fov,aspect,near=.1,far=100):
 f=1/math.tan(math.radians(fov)/2);m=np.zeros((4,4),dtype='f4');m[0,0]=f/aspect;m[1,1]=f;m[2,2]=(far+near)/(near-far);m[2,3]=2*far*near/(near-far);m[3,2]=-1;return m

def set_uniform(program,key,value):
 if key not in program:return
 if isinstance(value,np.ndarray) and value.ndim>1:program[key].write(value.T.astype('f4').tobytes())
 elif isinstance(value,list):program[key].value=tuple(value)
 else:program[key].value=value

def render(path):
 name=path.stem;meshes=json.loads(path.read_text())
 eye=[.3,.3,12.8] if name=='network' else [0,.4,8]
 target=[0,-.4,0] if name in ['seed','network'] else [0,-.2,0]
 view=look_at(eye,target);projection=perspective(44,W/H)
 fbo.clear(.031,.057,.044,1.,depth=1.)
 meshes.sort(key=lambda x:(bool(x['material']['transparent']),float((view@np.array(x['matrix']).reshape(4,4).T)[2,3])))
 for mesh in meshes:
  g=mesh['geometry'];m=mesh['material'];matrix=np.array(mesh['matrix'],dtype='f4').reshape(4,4).T;mv=view@matrix
  if abs(np.linalg.det(mv[:3,:3]))<1e-14:continue
  if m.get('vertexShader'):
   key=m['vertexShader']+m['fragmentShader']
   if key not in programs:programs[key]=ctx.program(vertex_shader=translate(m['vertexShader'],True),fragment_shader=translate(m['fragmentShader'],False))
   program=programs[key]
   for key,value in m['uniforms'].items():set_uniform(program,key,value)
  else:
   program=standard;set_uniform(program,'uColor',m['color']);set_uniform(program,'uEmissive',list(np.array(m['emissive'])*m['emissiveIntensity']));set_uniform(program,'uMetalness',m['metalness']);set_uniform(program,'uRoughness',m['roughness']);set_uniform(program,'uOpacity',m['opacity']);set_uniform(program,'uVertexColors',float('color' in g['attributes']))
  set_uniform(program,'modelViewMatrix',mv);set_uniform(program,'projectionMatrix',projection);set_uniform(program,'normalMatrix',np.linalg.inv(mv[:3,:3]).T)
  buffers=[];content=[];count=len(g['attributes']['position']['array'])//3
  for key in ['position','normal','uv','aBranch','aGrowth','color']:
   if key not in program:continue
   a=g['attributes'].get(key)
   if a is None:a={'array':([1,1,1]*count if key=='color' else [0,0,1]*count),'size':3}
   buffer=ctx.buffer(np.array(a['array'],dtype='f4').tobytes());buffers.append(buffer);content.append((buffer,f"{a['size']}f",key))
  indices=ctx.buffer(np.array(g['index'],dtype='i4').tobytes()) if g['index'] else None
  vao=ctx.vertex_array(program,content,index_buffer=indices)
  ctx.depth_mask=m.get('depthWrite',True)
  if m.get('depthTest',True):ctx.enable(moderngl.DEPTH_TEST)
  else:ctx.disable(moderngl.DEPTH_TEST)
  ctx.wireframe=bool(m['wireframe']);ctx.blend_func=(moderngl.SRC_ALPHA,moderngl.ONE) if m['blending']==2 else (moderngl.SRC_ALPHA,moderngl.ONE_MINUS_SRC_ALPHA)
  vao.render(moderngl.TRIANGLES);vao.release()
  for b in buffers:b.release()
  if indices:indices.release()
 im=Image.frombytes('RGBA',(W,H),fbo.read(components=4)).transpose(Image.Transpose.FLIP_TOP_BOTTOM).convert('RGB')
 im.save(OUT/f'{name}.webp',quality=89,method=6)
 ctx.enable(moderngl.DEPTH_TEST)
 return name,im

renders=[render(p) for p in sorted((ROOT/'.tmp/scenes').glob('*.json'))]
# A labelled review sheet uses exact rendered source geometry, with clear provenance.
order=['seed','network','terrain','domain-music','domain-ai','domain-film','domain-engineering','domain-education','domain-community']
labels=['StarrSeed','Living network','Floating world','Resonance Bloom','Neural Geode','Light Loom','Tectonic Engine','Discovery Helix','Mycelium Commons']
thumbs=dict(renders);sheet=Image.new('RGB',(1800,1990),'#080f0d');draw=ImageDraw.Draw(sheet)
font_path='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=ImageFont.truetype(font_path,26);small=ImageFont.truetype(font_path,16)
draw.text((36,27),'STARRTREE / INTERACTIVE ASSET LAB',font=font,fill='#e3d6b4')
draw.text((36,70),'Source geometry study  •  Native reference lighting  •  Browser review pending',font=small,fill='#90a48e')
for i,(name,label) in enumerate(zip(order,labels)):
 x=(i%3)*600;y=115+(i//3)*610
 im=thumbs[name].copy();im.thumbnail((580,550),Image.Resampling.LANCZOS);sheet.paste(im,(x+(600-im.width)//2,y))
 draw.text((x+30,y+542),f'{i+1:02d}   {label}',font=font,fill='#cfbc8f')
sheet.save(PREVIEWS/'starrtree-source-study.jpg',quality=94)
(PREVIEWS/'renderer.json').write_text(json.dumps({'renderer':ctx.info['GL_RENDERER'],'resolution':[W,H],'customShaderProgramsCompiled':len(programs),'provenance':'Native EGL renders of mounted R3F geometry. Reference standard-material lighting. Not browser screenshots.','images':[name for name,_ in renders]},indent=2)+'\n')
print(json.dumps({'rendered':len(renders),'customShaderProgramsCompiled':len(programs),'sheet':str(PREVIEWS/'starrtree-source-study.jpg')}))
