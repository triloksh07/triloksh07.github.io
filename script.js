// References to HTML elements
const uidSection = document.getElementById('uid-section');
const resultSection = document.getElementById('result-section');
const checkUidButton = document.getElementById('checkUid');
const uidInput = document.getElementById('uid');
const resultMessage = document.getElementById('resultMessage');
const viewDetailsButton = document.getElementById('viewDetails');
const detailsSection = document.getElementById('detailsSection');

let csvData; // To store CSV data
let userInfo; // To store user information for later use

// Handle UID check
checkUidButton.addEventListener('click', () => {
    const enteredUid = uidInput.value.trim();

    if (!enteredUid) {
        alert('Please enter your UID.');
        return;
    }

    // Remove previous themes
    uidInput.classList.remove('green-theme', 'red-theme');
    resultMessage.classList.remove('success', 'error');

    // Fetch UID data from the CSV file
    fetch('Eligible_Students_List_UPDATED_19_01_25.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch the UID data');
            }
            return response.text();
        })
        .then(data => {
            csvData = data; // Store CSV data for later use
            console.log("CSV Data loaded successfully");
            const rows = data.split('\n').map(row => row.split(',').map(cell => cell.trim()));
            const header = rows[0]; // First row is the header
            const uidIndex = header.indexOf('Enrollment Number');
            const eligibilityIndex = header.indexOf('Eligible for GSPL Auction');

            // Check if the entered UID is eligible and get related information
            userInfo = null;
            for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header
                if (rows[i][uidIndex] === enteredUid) {
                    userInfo = rows[i];
                    break;
                }
            }

            if (userInfo) {
                const isEligible = userInfo[eligibilityIndex] === 'TRUE';
                if (isEligible) {
                    // UID is selected and eligible
                    resultMessage.textContent = "Congratulations! You are an \"Elite\".";
                    resultMessage.classList.add('success');
                    uidInput.classList.add('green-theme');
                } else {
                    // UID is found but not eligible
                    resultMessage.innerHTML = `Sorry, you are not an Elite. To become Elite, participate in any of the events below:
                        <div class="event-list">
                            <div>Jugaadu - <a href="https://samaagum.com/find/single-detail?id=678a7cac1c9261899271338a" target="_blank" class="event-link">Register here</a></div>
                            <div>Makeathon - <a href="https://samaagum.com/find/single-detail?id=678c30b11c9261899271afb7" target="_blank" class="event-link">Register here</a></div>
                            <div>Trackathon - <a href="https://samaagum.com/find/single-detail?id=678c32b31c9261899271b408" target="_blank" class="event-link">Register here</a></div>
                            <div>Bootcamp - <a href="https://samaagum.com/find/single-detail?id=678a7b0f1c92618992713281" target="_blank" class="event-link">Register here</a></div>
                          
                        </div>`;
                    resultMessage.classList.add('error');
                    uidInput.classList.add('red-theme');
                }
            } else {
                // UID is not found
                resultMessage.textContent = "No information found for the entered UID.";
                resultMessage.classList.add('error');
                uidInput.classList.add('red-theme');
            }

            // Display the result section
            uidSection.classList.remove('active');
            resultSection.classList.add('active');
        })
        .catch(error => {
            console.error('Error fetching or processing UID data:', error);

            // Display an error message
            resultMessage.textContent = "An error occurred. Please try again later.";
            resultMessage.classList.add('error');

            // Display the result section
            uidSection.classList.remove('active');
            resultSection.classList.add('active');
        });
});

// Handle detailed results view
viewDetailsButton.addEventListener('click', () => {
    console.log("View Details button clicked");
    if (userInfo) {
        const rows = csvData.split('\n').map(row => row.split(',').map(cell => cell.trim()));
        const header = rows[0]; // First row is the header

        let detailsHtml = '<div class="details-container">';
        header.forEach((header, index) => {
            detailsHtml += `
                <div class="detail-item">
                    <span class="detail-label">${header}</span>
                    <span class="detail-value">${userInfo[index]}</span>
                </div>`;
        });
        detailsHtml += '</div>';

        // Populate the details section with the details
        detailsSection.innerHTML = detailsHtml;
        detailsSection.style.display = 'block';
    } else {
        alert('No detailed results available.');
    }
});
