const fs = require('fs');
const path = require('path');

function fixImports(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      fixImports(fullPath);
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix @radix-ui imports
      content = content.replace(/@radix-ui\/react-([a-z-]+)@[\d.]+/g, '@radix-ui/react-$1');
      
      // Fix other imports
      content = content.replace(/lucide-react@[\d.]+/g, 'lucide-react');
      content = content.replace(/class-variance-authority@[\d.]+/g, 'class-variance-authority');
      content = content.replace(/sonner@[\d.]+/g, 'sonner');
      content = content.replace(/next-themes@[\d.]+/g, 'next-themes');
      content = content.replace(/react-hook-form@[\d.]+/g, 'react-hook-form');
      content = content.replace(/react-day-picker@[\d.]+/g, 'react-day-picker');
      content = content.replace(/input-otp@[\d.]+/g, 'input-otp');
      content = content.replace(/embla-carousel-react@[\d.]+/g, 'embla-carousel-react');
      content = content.replace(/cmdk@[\d.]+/g, 'cmdk');
      content = content.replace(/recharts@[\d.]+/g, 'recharts');
      content = content.replace(/react-resizable-panels@[\d.]+/g, 'react-resizable-panels');
      content = content.replace(/vaul@[\d.]+/g, 'vaul');
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Fixed: ${fullPath}`);
    }
  });
}

fixImports('./src');
console.log('✅ All imports fixed!');