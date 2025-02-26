class FileHandler {
    constructor() {
        this.supportedTypes = {
            'png': ['jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff', 'ico', 'pdf'],
            'jpg': ['png', 'webp', 'gif', 'bmp', 'tiff', 'pdf', 'ico'],
            'jpeg': ['png', 'webp', 'gif', 'bmp', 'tiff', 'pdf', 'ico'],
            'zip': ['rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'iso'],
            'rar': ['zip', '7z', 'tar', 'gz'],
            'pdf': ['png', 'jpg', 'jpeg', 'webp']
        };
    }

    isSupported(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        return Object.keys(this.supportedTypes).includes(extension);
    }

    getConversionOptions(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        return this.supportedTypes[extension] || [];
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

export default FileHandler;