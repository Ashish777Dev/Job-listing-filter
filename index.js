const mainContent = document.querySelector(".main"); //parent container
const filterTab = document.querySelector(".filter-tab");
const clearFilterButton = document.getElementById("clear-filter");

let activeFilter = [];

async function loadData() {
  try {
    const res = await fetch("./data.json");

    const data = await res.json();

    //inject data and parentElement in renderJobList
    renderJobList(data, mainContent);
    toggleFilterTab();
  } catch (error) {
    throw new Error(`Failed to fetch data ERROR: ${error}`);
  }
}
loadData();

const toggleFilterTab = () =>
  (filterTab.style.display = activeFilter.length > 0 ? "flex" : "none");

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
                ${[card.role, card.level, ...card.languages, ...card.tools].map((skill) => `<span data-skill="${skill}">${skill}</span>`).join("")}  
            </div>
        </div>`;
    })
    .join("");

  parentElement.insertAdjacentHTML("beforeend", listCardMarkup);
}

selectRole(mainContent);

function selectRole(parentElement) {
  parentElement.addEventListener("click", (e) => {
    let span = e.target.dataset.skill;
    if (span) {
      let clickedSkill = e.target.dataset.skill;

      // if find duplicate tag don't show
      let duplicateTag = activeFilter.some((tag) => tag === clickedSkill);

      if (duplicateTag) return;
      else activeFilter.push(clickedSkill); //else push

      const tag = document.createElement("span"); //create a wrapper
      const text = document.createElement("p"); //Text clickedSkill
      const removeBtn = document.createElement("button");

      tag.classList.add("skilled-tag");
      removeBtn.classList.add("remove-btn");

      text.innerText = clickedSkill;

      // these will create a span tag with remove btn
      tag.appendChild(text);
      tag.appendChild(removeBtn);

      //append to main container(filter-tab div)
      filterTab.appendChild(tag);
      toggleFilterTab();
      jobFilter();
    }
  });
}

filterTab.addEventListener("click", (e) => {
  //if no remove btn return
  if (!e.target.classList.contains("remove-btn")) return;

  let tag = e.target.closest(".skilled-tag");
  let skill = tag.querySelector("p").innerText; //get tag innerText

  activeFilter = activeFilter.filter((s) => s !== skill);

  if (activeFilter.length > 0) {
    filterTab.style.display = "block";
  } else {
    filterTab.style.display = "none";
  }

  tag.remove();

  toggleFilterTab();
  //update job filter
  jobFilter();
});

function jobFilter() {
  // get All the cards
  document.querySelectorAll(".card").forEach((card) => {
    //get the data attributes from skilled tag
    const cardSkill = [...card.querySelectorAll("[data-skill]")].map(
      (el) => el.dataset.skill,
    );

    const match = activeFilter.every((s) => cardSkill.includes(s));

    card.classList.toggle("hidden", !match);
  });
}

clearFilterButton.addEventListener("click", (e) => {
  activeFilter = [];
  filterTab.querySelectorAll(".skilled-tag").forEach((tag) => tag.remove());
  toggleFilterTab();
  jobFilter();
});
