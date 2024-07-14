let currentAudio = null;

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".row-title").forEach(function (title) {
    title.addEventListener("click", function () {
      const target = document.querySelector(title.getAttribute("data-target"));
      const icon = title.querySelector(".toggle-icon");

      target.style.display =
        target.style.display === "none" || target.style.display === ""
          ? "block"
          : "none";

      icon.classList.toggle("fa-chevron-down");
      icon.classList.toggle("fa-chevron-up");

      title.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
  // General function
  function generalFunction(tiems, appendChild) {
    tiems.forEach((content) => {
      const row = document.createElement("div");
      row.className = "row";

      const colText = document.createElement("div");
      colText.className = "col-md-7 main-content-text";
      colText.innerHTML = `
            <h5>${content.title}</h5>
            <p>${content.text}</p>
          `;

      const colAudio = document.createElement("div");
      colAudio.className = "col-md-5 play-video";
      colAudio.innerHTML = `
            <div>
              <audio id="audio" controls>
                <source src="${content.audioSrc}" type="audio/mpeg">
                Your browser does not support the audio element.
              </audio>
              <h6>Listening Practice Through Dictation</h6>
                <ul>
                  <li><a data-bs-toggle="modal" href="#exampleModalToggle${content.id}" role="button">Listening Practice Through Dictation</a></li>
                </ul>
              <h6>Some ai check speech</h6>
                <ul>
                  <li><a href="https://www.speechtexter.com/">For all browser</a></li>
                  <li><a href="https://chromewebstore.google.com/detail/speech-to-text-voice-reco/kcgloaobfaiejoiahlhnfaolfcifjjho">For Chrome</a></li>
                </ul>
              <div class="modal fade" id="exampleModalToggle${content.id}" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
                <div class="modal-dialog modal-fullscreen">
                  <div class="modal-content">
                    <div class="modal-header">
                      <audio id="audio-${content.id}-modal" class="w-100" controls>
                        <source src="${content.audioSrc}" type="audio/mpeg">
                        Your browser does not support the audio element.
                      </audio>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close""></button>
                    </div>
                    <div class="modal-body">
                      <nav>
                        <div class="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                          <button class="nav-link active" id="nav-home-tab${content.id}" data-bs-toggle="tab" data-bs-target="#nav-home${content.id}" type="button" role="tab" aria-controls="nav-home${content.id}" aria-selected="true">Script</button>
                          <button class="nav-link" id="nav-profile-tab${content.id}" data-bs-toggle="tab" data-bs-target="#nav-profile${content.id}" type="button" role="tab" aria-controls="nav-profile${content.id}" aria-selected="false">Note</button>
                        </div>
                      </nav>
                      <div class="tab-content p-3 border bg-light" id="nav-tabContent">
                        <div class="tab-pane fade active show" id="nav-home${content.id}" role="tabpanel" aria-labelledby="nav-home-tab${content.id}">
                          <p>${content.text}</p>
                        </div>
                        <div class="tab-pane fade" id="nav-profile${content.id}" role="tabpanel" aria-labelledby="nav-profile-tab${content.id}">
                          <textarea name="" id="textarea-${content.id}"></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>  
            </div>
          `;

      row.appendChild(colText);
      row.appendChild(colAudio);
      appendChild.appendChild(row);

      const closeButton = colAudio.querySelector(
        `#exampleModalToggle${content.id} .btn-close`
      );
      closeButton.addEventListener("click", () => {
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      });

      const modalToggleLink = colAudio.querySelector(
        `a[href="#exampleModalToggle${content.id}"]`
      );
      modalToggleLink.addEventListener("click", () => {
        currentAudio = document.getElementById(`audio-${content.id}-modal`);
      });
    });
  }
  // Generate 40 checkboxes
  function generateCheckboxes(checkboxName, className) {
    contentArray3.forEach((item) => {
      const checkboxItem = document.createElement("div");
      checkboxItem.classList.add(className);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `${item.id}`;
      checkbox.value = `${item.audioSrc}cutinhere${item.title}`;

      const label = document.createElement("label");
      label.htmlFor = `${item.id}`;
      label.textContent = `${item.title}`;

      checkboxItem.appendChild(checkbox);
      checkboxItem.appendChild(label);
      checkboxName.appendChild(checkboxItem);
    })
  }
  // // part 1
  // // main content
  // const mainContentContainer1 = document.getElementById("main-content-1");
  // generalFunction(contentArray3, mainContentContainer1);
  // const checkboxList1 = document.querySelector(".checkbox-list-1");
  // // generate 40 checkboxes
  // generateCheckboxes(checkboxList1, "checkbox-item1", "./libraries/lptd3/");

  // part 3
  // main content
  const mainContentContainer3 = document.getElementById("main-content-3");
  generalFunction(contentArray3, mainContentContainer3);
  const checkboxList3 = document.querySelector(".checkbox-list-3");
  // generate 40 checkboxes
  generateCheckboxes(checkboxList3, "checkbox-item3");
});
