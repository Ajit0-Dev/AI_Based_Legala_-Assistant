// Character count for textarea
const caseDescription = document.getElementById('caseDescription');
const charCount = document.getElementById('charCount');

caseDescription.addEventListener('input', function() {
    const length = this.value.length;
    if (length < 20) {
        charCount.textContent = `${length} / 20 characters minimum`;
        charCount.style.color = '#ef4444';
    } else {
        charCount.textContent = `${length} characters`;
        charCount.style.color = '#10b981';
    }
});

// Form submission
const caseForm = document.getElementById('caseForm');
const submitBtn = document.getElementById('submitBtn');

caseForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const caseDescription = document.getElementById('caseDescription').value.trim();
    
    if (caseDescription.length < 20) {
        showError('Please provide at least 20 characters describing your legal issue.');
        return;
    }
    
    // Show loading state
    showLoading();
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ case_description: caseDescription })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Analysis failed. Please try again.');
        }
        
        const data = await response.json();
        displayResults(data.result);
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'An error occurred during analysis. Please try again.');
    } finally {
        submitBtn.disabled = false;
    }
});

// State management functions
function showLoading() {
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('resultsState').style.display = 'none';
    document.getElementById('loadingState').style.display = 'flex';
}

function showError(message) {
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('resultsState').style.display = 'none';
    document.getElementById('errorState').style.display = 'flex';
    document.getElementById('errorMessage').textContent = message;
}

function displayResults(result) {
    // Parse the result if it's a string
    let analysis;
    if (typeof result === 'string') {
        // Try to parse as JSON first
        try {
            analysis = JSON.parse(result);
        } catch (e) {
            // If not JSON, create a structured object from text
            analysis = { raw: result };
        }
    } else {
        analysis = result;
    }
    
    let resultsHTML = '';
    
    // Handle raw text analysis
    if (analysis.raw) {
        resultsHTML = `<p>${escapeHtml(analysis.raw)}</p>`;
    }
    
    // Case Intake Analysis
    if (analysis.case_intake) {
        resultsHTML += `
            <h5>📋 Case Intake Analysis</h5>
            <p>${escapeHtml(analysis.case_intake)}</p>
        `;
    }
    
    // IPC Sections
    if (analysis.ipc_sections) {
        resultsHTML += `
            <h5>⚖️ Applicable IPC Sections</h5>
            <p>${escapeHtml(analysis.ipc_sections)}</p>
        `;
    }
    
    // Legal Precedents
    if (analysis.legal_precedents) {
        resultsHTML += `
            <h5>📚 Relevant Legal Precedents</h5>
            <p>${escapeHtml(analysis.legal_precedents)}</p>
        `;
    }
    
    // Legal Advice/Draft
    if (analysis.legal_advice) {
        resultsHTML += `
            <h5>📄 Legal Advice & Recommendation</h5>
            <p>${escapeHtml(analysis.legal_advice)}</p>
        `;
    }
    
    if (analysis.legal_draft) {
        resultsHTML += `
            <h5>📄 Legal Document Draft</h5>
            <p>${escapeHtml(analysis.legal_draft)}</p>
        `;
    }
    
    // Show results
    document.getElementById('resultsContent').innerHTML = resultsHTML;
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('resultsState').style.display = 'flex';
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Reset form
function resetForm() {
    caseForm.reset();
    charCount.textContent = '0 / 20 characters minimum';
    charCount.style.color = '#9ca3af';
    document.getElementById('emptyState').style.display = 'flex';
    document.getElementById('resultsState').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('loadingState').style.display = 'none';
}

// Scroll to analyzer section
function scrollToAnalyzer() {
    const analyzerSection = document.getElementById('analyzer');
    analyzerSection.scrollIntoView({ behavior: 'smooth' });
}

// Health check on page load
window.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/api/health');
        if (!response.ok) {
            console.warn('Health check failed');
        }
    } catch (error) {
        console.warn('Unable to connect to API:', error);
    }
});
