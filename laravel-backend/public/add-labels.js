// ============================================
// AUTO-ADD LABELS TO INPUT FIELDS
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Wait a bit for modals to be in DOM
    setTimeout(() => {
        // Find all input fields in new tools
        const inputFields = document.querySelectorAll('.tool-modal .input-field');

        inputFields.forEach(field => {
            const input = field.querySelector('input, select');
            if (!input) return;

            // Get placeholder text
            let labelText = input.getAttribute('placeholder');
            if (!labelText || labelText.trim() === '') return;

            // Check if label already exists
            if (field.querySelector('.field-label')) return;

            // Create field-group wrapper if needed
            if (!field.parentElement.classList.contains('field-group')) {
                const fieldGroup = document.createElement('div');
                fieldGroup.className = 'field-group';
                field.parentNode.insertBefore(fieldGroup, field);
                fieldGroup.appendChild(field);
            }

            // Create label
            const label = document.createElement('label');
            label.className = 'field-label';
            label.textContent = labelText;

            // Insert label before input-field
            field.parentElement.insertBefore(label, field);

            // Clean placeholder (make it shorter or remove it)
            input.setAttribute('placeholder', '');
        });

        console.log('✅ Labels added to input fields');
    }, 500);
});
