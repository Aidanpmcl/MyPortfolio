const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// Create docs directory structure
const docsDir = path.join(__dirname, 'docs');
const docsCssDir = path.join(docsDir, 'css');
const docsImagesDir = path.join(docsDir, 'images');

// Clean and create directories
if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
}
fs.mkdirSync(docsDir);
fs.mkdirSync(docsCssDir);
fs.mkdirSync(docsImagesDir);

// Read layout template
const layoutSource = fs.readFileSync(
  path.join(__dirname, 'views/layouts/main.hbs'),
  'utf8'
);

// Compile layout
const layoutTemplate = handlebars.compile(layoutSource);

// Pages to generate
const pages = [
  { name: 'index', view: 'home', title: 'Home', context: { isHome: true } },
  { name: 'about', view: 'about', title: 'About', context: { isAbout: true } },
  { name: 'projects', view: 'projects', title: 'Projects', context: { isProjects: true } },
  { name: 'contact', view: 'contact', title: 'Contact', context: { isContact: true } }
];

// Generate HTML files
pages.forEach(page => {
  const viewSource = fs.readFileSync(
    path.join(__dirname, `views/${page.view}.hbs`),
    'utf8'
  );
  
  const viewTemplate = handlebars.compile(viewSource);
  const viewHtml = viewTemplate(page.context);
  
  const fullHtml = layoutTemplate({
    title: page.title,
    body: viewHtml,
    ...page.context
  });
  
  const filename = page.name === 'index' ? 'index.html' : `${page.name}.html`;
  fs.writeFileSync(path.join(docsDir, filename), fullHtml);
  console.log(`✓ Generated ${filename}`);
});

// Copy CSS
const cssSource = path.join(__dirname, 'public/css/output.css');
if (fs.existsSync(cssSource)) {
  fs.copyFileSync(cssSource, path.join(docsCssDir, 'output.css'));
  console.log('✓ Copied CSS files');
} else {
  console.warn('⚠ Warning: CSS file not found. Run tailwind:build first.');
}

// Copy images
const imagesSourceDir = path.join(__dirname, 'public/images');
if (fs.existsSync(imagesSourceDir)) {
  const imageFiles = fs.readdirSync(imagesSourceDir).filter(file => file !== '.gitkeep');
  imageFiles.forEach(file => {
    fs.copyFileSync(
      path.join(imagesSourceDir, file),
      path.join(docsImagesDir, file)
    );
  });
  if (imageFiles.length > 0) {
    console.log(`✓ Copied ${imageFiles.length} image(s)`);
  }
}

// Copy any PDF files from root to docs
const pdfFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.pdf'));
pdfFiles.forEach(file => {
  fs.copyFileSync(
    path.join(__dirname, file),
    path.join(docsDir, file)
  );
});
if (pdfFiles.length > 0) {
  console.log(`✓ Copied ${pdfFiles.length} PDF file(s)`);
}

// Copy .nojekyll file to docs for GitHub Pages
const nojekyllSource = path.join(__dirname, '.nojekyll');
if (fs.existsSync(nojekyllSource)) {
  fs.copyFileSync(nojekyllSource, path.join(docsDir, '.nojekyll'));
  console.log('✓ Copied .nojekyll file');
}

console.log('\n✅ Build complete! Static files generated in docs/ folder');
console.log('📦 Ready for GitHub Pages deployment');

