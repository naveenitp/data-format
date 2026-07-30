document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const charCount = document.getElementById('charCount');
    const removeSpacesCheckbox = document.getElementById('removeSpaces');
    const trimLinesCheckbox = document.getElementById('trimLines');
    const addQuotesCheckbox = document.getElementById('addQuotes');
    const ensureNewlinesCheckbox = document.getElementById('ensureNewlines');
    const convertToUppercaseCheckbox = document.getElementById('convertToUppercase');
    const convertToLowercaseCheckbox = document.getElementById('convertToLowercase');
    const applyFormattingButton = document.getElementById('applyFormatting');
    const downloadTxtButton = document.getElementById('downloadTxt');
    const downloadCsvButton = document.getElementById('downloadCsv');

    // Function to update character count
    const updateCharCount = () => {
        charCount.textContent = inputText.value.length;
    };

    // Main formatting function
    const applyFormatting = () => {
        let data = inputText.value;

        // Split data into lines for line-based operations,
        // but keep original for full text operations first
        let lines = data.split('\n');

        if (removeSpacesCheckbox.checked) {
            data = data.replace(/\s/g, ''); // Remove all whitespace characters
            lines = data.split('\n'); // Re-split if full text was modified
        }

        if (trimLinesCheckbox.checked) {
            lines = lines.map(line => line.trim());
            data = lines.join('\n');
        }

        if (addQuotesCheckbox.checked) {
            // Apply to each line *after* trimming/spacing, but before ensuring newlines potentially splits further
            lines = lines.map(line => `"${line}"`);
            data = lines.join('\n');
        }

        if (ensureNewlinesCheckbox.checked) {
            // This assumes items are separated by commas or existing newlines
            // and we want each 'item' on its own line.
            // It will split by commas, then by newlines, trim, filter empty, and rejoin.
            lines = data.split(/,|\n/)
                        .map(item => item.trim())
                        .filter(item => item !== '');
            data = lines.join('\n');
        }
        
        if (convertToUppercaseCheckbox.checked) {
            data = data.toUpperCase();
        }

        if (convertToLowercaseCheckbox.checked) {
            data = data.toLowerCase();
        }

        outputText.value = data;
    };

    // Function to download text
    const downloadFile = (filename, content, type) => {
        const blob = new Blob([content], { type: type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Event Listeners
    inputText.addEventListener('input', updateCharCount);
    applyFormattingButton.addEventListener('click', applyFormatting);

    downloadTxtButton.addEventListener('click', () => {
        downloadFile('formatted_data.txt', outputText.value, 'text/plain');
    });

    downloadCsvButton.addEventListener('click', () => {
        // For CSV, we'll try to convert newlines to rows and handle commas if not already quoted.
        // A simple approach: output is already line-separated. If addQuotes was used, it's fine.
        // If not, we might need more sophisticated CSV escaping depending on content.
        // For now, assuming direct output is suitable or addQuotes was applied.
        downloadFile('formatted_data.csv', outputText.value, 'text/csv');
    });

    // Initial character count
    updateCharCount();
});
