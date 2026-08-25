#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 3.8);
}

/* Làm gọn MỘT đoạn văn xuôi (đã chắc chắn nằm ngoài code block). */
function lamGonVanXuoi(text) {
  /* Nối dòng bị ngắt vụn giữa câu. Chốt chặn (?!\s*\d+[.)]) để KHÔNG nuốt
     mục danh sách đánh số: "1. Bước một" + "2. Bước hai" phải nằm 2 dòng. */
  text = text.replace(/([^\n#|\-*>`\d.])\n(?!\s*\d+[.)]\s)([a-zA-Z0-9à-ỹÀ-Ỹ])/g, '$1 $2');
  /* Nén khoảng trắng GIỮA câu nhưng giữ nguyên thụt lề đầu dòng — danh sách
     lồng cần 2-4 dấu cách, bóp về 1 là mất cấp. */
  text = text.split('\n').map(function (line) {
    const m = line.match(/^([ \t]*)(.*)$/);
    return m[1] + m[2].replace(/[ \t]+/g, ' ');
  }).join('\n');
  return text.replace(/\n{3,}/g, '\n\n');
}

function smartCleanText(rawText) {
  if (!rawText) return '';
  const lines = rawText.split(/\r?\n/);
  const lineFreq = {};
  lines.forEach(function(line) {
    const t = line.trim();
    if (t.length > 5 && t.length < 80) {
      lineFreq[t] = (lineFreq[t] || 0) + 1;
    }
  });

  const repeatedHeaders = new Set();
  Object.keys(lineFreq).forEach(function(k) {
    if (lineFreq[k] >= 3 && !k.startsWith('#') && !k.startsWith('|') && !k.startsWith('-')) {
      repeatedHeaders.add(k);
    }
  });

  const pageRegex = /^(trang|page)\s*\d+/i;
  const numRegex = /^[-–—_\s]*\d+[-–—_\s]*$/;
  const cleanedLines = [];
  let inCode = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (t.startsWith('```')) {
      inCode = !inCode;
      cleanedLines.push(line);
      continue;
    }
    if (inCode) {
      cleanedLines.push(line);
      continue;
    }
    if (t === '') {
      if (cleanedLines.length > 0 && cleanedLines[cleanedLines.length - 1].trim() !== '') {
        cleanedLines.push('');
      }
      continue;
    }
    if (pageRegex.test(t) || numRegex.test(t)) continue;
    if (repeatedHeaders.has(t)) continue;
    cleanedLines.push(line);
  }

  /* Gộp dòng + nén khoảng trắng — CHỈ cho văn xuôi, KHÔNG cho code block.
     Vòng lặp trên đã giữ nguyên code, nhưng 3 phép replace chạy trên CẢ chuỗi
     sẽ xoá công đó: nối dòng lệnh vào dòng chú thích "#" (lệnh mất tác dụng)
     và bóp thụt lề. Nên phải tách hàng rào ``` ra trước rồi mới xử lý. */
  const segments = cleanedLines.join('\n').split(/(```[\s\S]*?```)/g);
  const result = segments
    .map(function (seg) { return seg.startsWith('```') ? seg : lamGonVanXuoi(seg); })
    .join('');
  return result.trim() + '\n';
}

function processFile(inputPath, outputPath) {
  if (!fs.existsSync(inputPath)) {
    console.error('Loi: Khong tim thay file:', inputPath);
    process.exit(1);
  }
  const raw = fs.readFileSync(inputPath, 'utf8');
  const cleaned = smartCleanText(raw);
  const tokensBefore = estimateTokens(raw);
  const tokensAfter = estimateTokens(cleaned);
  const saved = tokensBefore - tokensAfter;
  const pct = tokensBefore > 0 ? ((saved / tokensBefore) * 100).toFixed(1) : 0;
  const out = outputPath || inputPath.replace(/\.[^.]+$/, '') + '.clean.md';
  /* Chặn ghi đè bản gốc: công cụ này xoá bớt nội dung, ghi đè là mất luôn. */
  if (path.resolve(out) === path.resolve(inputPath)) {
    console.error('Loi: file dau ra trung file dau vao — se ghi de mat ban goc. Dat ten khac.');
    process.exit(1);
  }
  fs.writeFileSync(out, cleaned, 'utf8');

  console.log('==================================================');
  console.log('✨ KET QUA SMART CLEAN & TOI UU TOKEN (getMDready)');
  console.log('==================================================');
  console.log('📂 File goc:', inputPath);
  console.log('📄 File Markdown sach:', out);
  console.log('📊 Token ban dau:', tokensBefore.toLocaleString(), 'tokens');
  console.log('⚡ Token sau khi lam sach:', tokensAfter.toLocaleString(), 'tokens');
  console.log('💰 Tiet kiem duoc:', saved.toLocaleString(), 'tokens (' + pct + '%)');
  console.log('==================================================');
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Cach dung: node scripts/smart-clean-md.cjs <file_dau_vao> [file_dau_ra.md]');
  process.exit(0);
}
processFile(args[0], args[1]);