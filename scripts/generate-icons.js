const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Criar diretório de ícones se não existir
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Fundo transparente
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, size, size);
  
  // Escala baseada no tamanho
  const scale = size / 32;
  
  // Desenhar rede neural (pontos)
  ctx.fillStyle = '#4F46E5';
  ctx.globalAlpha = 0.6;
  
  // Layer 1
  ctx.beginPath();
  ctx.arc(6 * scale, 8 * scale, 1.5 * scale, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(6 * scale, 16 * scale, 1.5 * scale, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(6 * scale, 24 * scale, 1.5 * scale, 0, 2 * Math.PI);
  ctx.fill();
  
  // Layer 2
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(14 * scale, 6 * scale, 1.5 * scale, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(14 * scale, 12 * scale, 1.5 * scale, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(14 * scale, 18 * scale, 1.5 * scale, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(14 * scale, 26 * scale, 1.5 * scale, 0, 2 * Math.PI);
  ctx.fill();
  
  // Layer 3
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.arc(22 * scale, 10 * scale, 1.5 * scale, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(22 * scale, 16 * scale, 1.5 * scale, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(22 * scale, 22 * scale, 1.5 * scale, 0, 2 * Math.PI);
  ctx.fill();
  
  // Linhas de conexão
  ctx.strokeStyle = '#4F46E5';
  ctx.lineWidth = 0.8 * scale;
  ctx.globalAlpha = 0.4;
  
  ctx.beginPath();
  ctx.moveTo(6 * scale, 8 * scale);
  ctx.lineTo(14 * scale, 6 * scale);
  ctx.moveTo(6 * scale, 8 * scale);
  ctx.lineTo(14 * scale, 12 * scale);
  ctx.moveTo(6 * scale, 16 * scale);
  ctx.lineTo(14 * scale, 12 * scale);
  ctx.moveTo(6 * scale, 16 * scale);
  ctx.lineTo(14 * scale, 18 * scale);
  ctx.moveTo(6 * scale, 24 * scale);
  ctx.lineTo(14 * scale, 18 * scale);
  ctx.moveTo(6 * scale, 24 * scale);
  ctx.lineTo(14 * scale, 26 * scale);
  ctx.stroke();
  
  // Lupa
  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 2 * scale;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  
  ctx.beginPath();
  ctx.arc(20 * scale, 12 * scale, 6 * scale, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Cabo da lupa
  ctx.beginPath();
  ctx.moveTo(24.5 * scale, 16.5 * scale);
  ctx.lineTo(28 * scale, 20 * scale);
  ctx.lineWidth = 2.5 * scale;
  ctx.lineCap = 'round';
  ctx.stroke();
  
  // Pontos dentro da lupa
  ctx.fillStyle = '#1E293B';
  ctx.globalAlpha = 1;
  
  ctx.beginPath();
  ctx.arc(18 * scale, 10 * scale, 1.2 * scale, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(22 * scale, 12 * scale, 1.2 * scale, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(20 * scale, 14 * scale, 1.2 * scale, 0, 2 * Math.PI);
  ctx.fill();
  
  // Sparkles
  ctx.fillStyle = '#4F46E5';
  ctx.globalAlpha = 0.6;
  
  ctx.beginPath();
  ctx.moveTo(4 * scale, 4 * scale);
  ctx.lineTo(5 * scale, 5 * scale);
  ctx.lineTo(4 * scale, 6 * scale);
  ctx.lineTo(3 * scale, 5 * scale);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(28 * scale, 6 * scale);
  ctx.lineTo(29 * scale, 7 * scale);
  ctx.lineTo(28 * scale, 8 * scale);
  ctx.lineTo(27 * scale, 7 * scale);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(2 * scale, 28 * scale);
  ctx.lineTo(3 * scale, 29 * scale);
  ctx.lineTo(2 * scale, 30 * scale);
  ctx.lineTo(1 * scale, 29 * scale);
  ctx.closePath();
  ctx.fill();
  
  return canvas;
}

// Tamanhos para gerar
const sizes = [16, 32, 64, 128, 256, 512];

try {
  for (const size of sizes) {
    const canvas = drawIcon(size);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.png`), buffer);
    console.log(`✓ Gerado: icon-${size}x${size}.png`);
  }
  
  // Ícone principal
  const mainCanvas = drawIcon(256);
  const mainBuffer = mainCanvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, '../public/icon.png'), mainBuffer);
  console.log('✓ Gerado: icon.png');
  
  console.log('🎉 Todos os ícones foram gerados com sucesso!');
} catch (error) {
  console.error('❌ Erro ao gerar ícones:', error);
} 