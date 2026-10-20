const mainContent = document.querySelector(".main"); //parent container
async function loadData() {
  try {
    const res = await fetch("./data.json");

    const data = await res.json();

    //inject data and parentElement in renderJobList
    renderJobList(data, mainContent);
  } catch (error) {
    throw new Error(`Failed to fetch data ERROR: ${error}`);
  }
}
loadData();

function renderJobList(data, parentElement) {
  // list card markup
  const listCardMarkup = data
    .map((card, i) => {
      return ` <div class="card">
            <div class="image-and-details">
                <!-- image section -->
                <div class="img-box">
                    <img src="${card.logo}" alt="${card.company}" srcset="">
                </div>

                <!-- details -->
                <div class="details">

                    <!-- company and tags -->
                    <div>
                        <p>${card.company}</p>
                        <span class="tag tag-new">New!</span>
                        <span class="tag tag-featured">Featured</span>
                    </div>

                    <!-- Job title -->
                    <h3>Senior Frontend Developer</h3>

                    <!-- meta info -->
                    <div class="meta">
                        <span>${card.postedAt}</span>
                        <span>${card.contract}</span>
                        <span> ${card.location}</span>
                    </div>
                </div>
            </div>
            <!-- Categories -->
            <div class="categories">
                <span data-role="${card.role}">${card.role}</span>
                <span data-level="${card.level}">${card.level}</span>
                ${card.languages.map((lang) => `<span data-language="${lang}">${lang}</span>`).join("")}
                ${card.tools.map((tool) => `<span data-tool="${tool}">${tool}</span>`).join("")}
                
            </div>
        </div>`;
    })
    .join("");

  parentElement.insertAdjacentHTML("beforeend", listCardMarkup);
}
