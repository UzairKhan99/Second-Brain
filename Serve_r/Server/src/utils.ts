export function generateShareLink(userId:string){
  let options="abcdefghijklmnopqrstuvwxyz0123456789";
  let shareLink="";
  for(let i=0;i<10;i++){
    shareLink+=options[Math.floor(Math.random()*options.length)];
  }
  return shareLink;
} 