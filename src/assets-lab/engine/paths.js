export function labRootPath(pathname) {
  const match=pathname.match(/^(.*\/)assets-lab(?:\/|$)/);
  return match?match[1]:pathname.endsWith('/')?pathname:pathname.slice(0,pathname.lastIndexOf('/')+1);
}
