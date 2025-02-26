import FileHandler from './fileHandler.js';

const fileHandler = new FileHandler();
const elements = {
    fileInput: document.getElementById('file-input'),
    initialState: document.getElementById('initial-state'),
    fileInfo: document.getElementById('file-info'),
    loadingOverlay: document.getElementById('loading-overlay'),
    loadingText: document.getElementById('loading-text'),
    conversionOptions: document.getElementById('conversion-options'),
    convertSelect: document.getElementById('convert-select'),
    convertButton: document.getElementById('convert-button'),
    downloadButton: document.getElementById('download-button'),
    resetButton: document.getElementById('reset-button'),
    dropZone: document.querySelector('.file-drop-zone')
};

// File conversion options mapping
const fileConversionTypes = {
    'png': ['jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff', 'ico', 'pdf'],
    'jpg': ['png', 'webp', 'gif', 'bmp', 'tiff', 'pdf', 'ico'],
    'jpeg': ['png', 'webp', 'gif', 'bmp', 'tiff', 'pdf', 'ico'],
    'zip': ['rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'iso'],
    'rar': ['zip', '7z', 'tar', 'gz'],
    'pdf': ['png', 'jpg', 'jpeg', 'webp']
};

function resetTool() {
    elements.fileInput.value = '';
    elements.fileInfo.classList.add('hidden');
    elements.conversionOptions.classList.add('hidden');
    elements.convertButton.classList.add('hidden');
    elements.downloadButton.classList.add('hidden');
    elements.resetButton.classList.add('hidden');
    elements.initialState.classList.remove('hidden');
    elements.dropZone.classList.remove('hidden');
    
    // Clear stored data
    elements.downloadButton.removeAttribute('data-original-file');
    elements.downloadButton.removeAttribute('data-target-format');
    elements.downloadButton.removeAttribute('data-file-content');
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Hide file input and show loading
    elements.dropZone.classList.add('hidden');
    elements.loadingOverlay.classList.remove('hidden');
    elements.loadingText.textContent = 'Keep wait, your file has been uploading...';

    setTimeout(() => {
        if (fileHandler.isSupported(file)) {
            // Update file info
            document.querySelector('.file-name').textContent = file.name;
            document.querySelector('.file-size').textContent = fileHandler.formatFileSize(file.size);
            
            // Update UI
            elements.loadingOverlay.classList.add('hidden');
            elements.fileInfo.classList.remove('hidden');
            elements.initialState.classList.add('hidden');
            
            // Update conversion options
            const options = fileHandler.getConversionOptions(file);
            elements.convertSelect.innerHTML = '<option value="">Select conversion type...</option>' +
                options.map(opt => `<option value="${opt}">${opt.toUpperCase()}</option>`).join('');
            
            elements.conversionOptions.classList.remove('hidden');
            elements.convertButton.classList.remove('hidden');
        } else {
            alert('Unsupported file type');
            resetTool();
        }
    }, 1500);
}

function handleConversion() {
    if (!elements.convertSelect.value) {
        alert('Please select a conversion type');
        return;
    }

    const file = elements.fileInput.files[0];
    const targetFormat = elements.convertSelect.value;
    
    // Store original file info for download
    elements.downloadButton.setAttribute('data-original-file', file.name);
    elements.downloadButton.setAttribute('data-target-format', targetFormat);

    elements.loadingOverlay.classList.remove('hidden');
    elements.loadingText.textContent = 'Wait pardon, your file has been converting...';
    elements.convertButton.classList.add('hidden');

    // Create a FileReader to read the file content
    const reader = new FileReader();
    reader.onload = function(e) {
        // Store the file content for download
        elements.downloadButton.setAttribute('data-file-content', e.target.result);
        
        setTimeout(() => {
            elements.loadingOverlay.classList.add('hidden');
            elements.downloadButton.classList.remove('hidden');
            elements.resetButton.classList.remove('hidden');
        }, 2000);
    };
    reader.readAsDataURL(file);
}

function handleDownload() {
    const originalFileName = elements.downloadButton.getAttribute('data-original-file');
    const targetFormat = elements.downloadButton.getAttribute('data-target-format');
    const fileContent = elements.downloadButton.getAttribute('data-file-content');

    // Create the new filename with requested format
    const newFileName = originalFileName.split('.')[0] + '.' + targetFormat;

    // Create a link with the file content
    const link = document.createElement('a');
    link.href = fileContent;
    link.download = newFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Reset the tool after download
    setTimeout(() => {
        resetTool();
        // Show success message
        alert(`File converted and downloaded as ${newFileName}`);
    }, 1000);
}

// Add toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-black text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 flex items-center space-x-2 z-50 translate-y-[-100%] opacity-0';
    toast.innerHTML = `
        <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        <span class="font-medium">${message}</span>
    `;
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-[-100%]', 'opacity-0');
    });
    
    // Animate out
    setTimeout(() => {
        toast.classList.add('translate-y-[-100%]', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Mobile menu handler
function setupMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeButton = document.getElementById('close-menu');

    menuButton?.addEventListener('click', () => {
        mobileMenu?.classList.remove('translate-x-full', 'opacity-0');
        mobileMenu?.classList.add('translate-x-0', 'opacity-100');
        document.body.style.overflow = 'hidden';
    });

    const closeMenu = () => {
        mobileMenu?.classList.add('translate-x-full');
        mobileMenu?.classList.remove('translate-x-0');
        setTimeout(() => {
            mobileMenu?.classList.add('opacity-0');
            document.body.style.overflow = '';
        }, 300);
    };

    closeButton?.addEventListener('click', closeMenu);
    mobileMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// Scroll to tool section
document.querySelector('a[href="#tool"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#tool')?.scrollIntoView({ behavior: 'smooth' });
});

// Show professional coming soon toast
const reachOutButtons = document.querySelectorAll('a[href="#contact"]');
reachOutButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('🚀 Coming Soon! We\'re crafting something amazing.');
    });
});

// Initialize mobile menu
setupMobileMenu();

// Event Listeners
elements.fileInput.addEventListener('change', handleFileSelect);
elements.convertButton.addEventListener('click', handleConversion);
elements.resetButton?.addEventListener('click', resetTool);
elements.downloadButton?.addEventListener('click', () => {
    handleDownload();
    setTimeout(resetTool, 1000);
});

// Update button classes
elements.convertButton.classList.add('action-button');
elements.downloadButton.classList.add('action-button');