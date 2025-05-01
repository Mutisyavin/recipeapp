const fs = require('fs');
const path = require('path');

// Create PDF directory in the parent folder if it doesn't exist
const pdfDir = path.join(__dirname, '..', '..', 'PDF');
if (!fs.existsSync(pdfDir)) {
  console.log(`Creating PDF directory at: ${pdfDir}`);
  fs.mkdirSync(pdfDir, { recursive: true });
}

// Create a sample PDF file with content for testing
const samplePdfPath = path.join(pdfDir, 'sample-recipe.pdf');
console.log(`PDF directory is set up at: ${pdfDir}`);
console.log('To use the PDF recipe feature:');
console.log('1. Place your PDF recipe books in the PDF directory');
console.log(`2. Visit http://localhost:3000/recipes/pdf to see your imported recipes`);
console.log('');
console.log('Note: You need to have actual PDF files in the directory for the app to process them.');
console.log('The DeepSeek API will be used to extract recipe information from the PDFs.') 