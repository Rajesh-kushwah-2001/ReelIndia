let currentShareUrl = "";
const q = (id) => document.getElementById(id);
export function attachShareHandlers(){ q("shareClose").onclick = () => q("sharePanel").classList.remove("show"); }
export function openShare(url){
  currentShareUrl = url;
  q("shareWA").href = `https://wa.me/?text=${encodeURIComponent(url)}`;
  q("shareFB").href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  q("shareTW").href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
  q("shareNative").onclick = async () => { try { if (navigator.share) await navigator.share({title:"ReelIndia", text:"Check this reel", url}); else alert("Native share not supported"); } catch{} };
  q("shareCopy").onclick = async () => { try { await navigator.clipboard.writeText(url); alert("Link copied ✅"); } catch{} };
  q("sharePanel").classList.add("show");
}
