// Store the original job data and the current filters
let allJobs = [];
let activeFilters = [];

// Function to fetch and render job listings
async function loadJobs() {
    try {
        // Fetch the JSON data
        const response = await fetch("data.json");
        allJobs = await response.json();

        // Render the jobs initially
        renderJobs(allJobs);

        // Add event listener for the "Clear Filters" button
        document.getElementById("clearFilters").addEventListener("click", clearFilters);

        // Re-render on window resize to ensure layout updates
        window.addEventListener("resize", () => renderJobs(allJobs));
    } catch (error) {
        console.error("Error loading jobs:", error);
    }
}

// Function to render jobs based on the current filters
function renderJobs(jobs) {
    const jobContainer = document.getElementById("jobContainer");
    jobContainer.innerHTML = ''; // Clear the container

    // Filter jobs based on active filters
    const filteredJobs = jobs.filter(job => {
        if (activeFilters.length === 0) return true;
        const jobSkills = [job.role, job.level, ...job.languages, ...job.tools];
        return activeFilters.every(filter => jobSkills.includes(filter));
    });

    // If there are no jobs to display, show a message
    if (filteredJobs.length === 0) {
        jobContainer.innerHTML = "<p>No jobs match the selected filters.</p>";
        return;
    }

    // Render each job
    filteredJobs.forEach(job => {
        // Create the job card element
        const jobCard = document.createElement("div");
        jobCard.classList.add("job-card");
        // Add 'featured' class if the job is featured
        if (job.featured) {
            jobCard.classList.add("featured");
        }

        // Create the logo section
        const logoDiv = document.createElement("div");
        logoDiv.classList.add("logo");
        const logoImg = document.createElement("img");
        logoImg.src = job.logo;
        logoImg.alt = `${job.company} logo`;
        logoDiv.appendChild(logoImg);

        // Create the job details section
        const jobDetails = document.createElement("div");
        jobDetails.classList.add("job-details");

        // Company and tags
        const companyTags = document.createElement("div");
        companyTags.classList.add("company-tags");
        const companySpan = document.createElement("span");
        companySpan.classList.add("company");
        companySpan.textContent = job.company;
        companyTags.appendChild(companySpan);

        // Add tags (e.g., NEW!, FEATURED)
        if (job.new) {
            const newTag = document.createElement("span");
            newTag.classList.add("tag", "new");
            newTag.textContent = "NEW!";
            companyTags.appendChild(newTag);
        }
        if (job.featured) {
            const featuredTag = document.createElement("span");
            featuredTag.classList.add("tag", 'featured');
            featuredTag.textContent = 'FEATURED';
            companyTags.appendChild(featuredTag);
        }

        // Job title
        const jobTitle = document.createElement("h2");
        jobTitle.classList.add("job-title");
        jobTitle.textContent = job.position;

        // Job metadata (postedAt, contract, location)
        const jobMeta = document.createElement("div");
        jobMeta.classList.add("job-meta");
        const metaItems = [job.postedAt, job.contract, job.location];
        metaItems.forEach((metaItem, index) => {
            const metaSpan = document.createElement("span");
            metaSpan.textContent = metaItem;
            jobMeta.appendChild(metaSpan);
            if (index < metaItems.length - 1) {
                jobMeta.appendChild(document.createTextNode(" • "));
            }
            // Add a horizontal line after the location (last item)
            if (index === metaItems.length - 1) {
                const hrDiv = document.createElement("div");
                hrDiv.classList.add("meta-divider");
                jobMeta.appendChild(hrDiv);
            }
        });

        // Append company tags, title, and meta to job details
        jobDetails.appendChild(companyTags);
        jobDetails.appendChild(jobTitle);
        jobDetails.appendChild(jobMeta);

        // Create the skills section (role, level, languages, tools)
        const skillsDiv = document.createElement("div");
        skillsDiv.classList.add("skills");
        const allSkills = [job.role, job.level, ...job.languages, ...job.tools];
        allSkills.forEach(skill => {
            const skillSpan = document.createElement("span");
            skillSpan.classList.add("skill");
            skillSpan.textContent = skill;
            skillSpan.addEventListener("click", () => addFilter(skill));
            skillsDiv.appendChild(skillSpan);
        });

        // Append all sections to the job card
        jobCard.appendChild(logoDiv);
        jobCard.appendChild(jobDetails);
        jobCard.appendChild(skillsDiv);

        // Append the job card to the container
        jobContainer.appendChild(jobCard);
    });

    // Update the filter bar visibility
    updateFilterBar();
}

// Function to add a filter
function addFilter(skill) {
    if (!activeFilters.includes(skill)) {
        activeFilters.push(skill);
        renderJobs(allJobs);
    }
}

// Function to remove a specific filter
function removeFilter(skill) {
    activeFilters = activeFilters.filter(filter => filter !== skill);
    renderJobs(allJobs);
}

// Function to clear all filters
function clearFilters() {
    activeFilters = [];
    renderJobs(allJobs);
}

// Function to update the filter bar
function updateFilterBar() {
    const filterBar = document.getElementById("filterBar");
    const activeFiltersDiv = document.getElementById("activeFilters");
    activeFiltersDiv.innerHTML = "";

    if (activeFilters.length > 0) {
        filterBar.style.display = "flex";
        activeFilters.forEach(filter => {
            // Create the filter tag container
            const filterSpan = document.createElement("span");
            filterSpan.classList.add("active-filter");

            // Add the filter text
            const filterText = document.createElement("span");
            filterText.classList.add("filter-text");
            filterText.textContent = filter;
            filterSpan.appendChild(filterText);

            // Add the remove button
            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-filter");
            removeButton.textContent = "x"; // Using "×" for a cleaner look
            removeButton.setAttribute('Heebo', `Remove ${filter} filter`);
            removeButton.addEventListener("click", () => removeFilter(filter));
            filterSpan.appendChild(removeButton);

            activeFiltersDiv.appendChild(filterSpan);
        });
    } else {
        filterBar.style.display = 'none';
    }
}

// Load the jobs when the page loads
document.addEventListener("DOMContentLoaded", loadJobs);