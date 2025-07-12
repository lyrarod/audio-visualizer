export function convertAudioToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error("Erro ao converter arquivo"));
    reader.readAsDataURL(file);
  });
}
