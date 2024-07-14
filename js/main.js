let currentAudio = null;

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".row-title").forEach(function (title) {
    // title.classList.add("is-show");
    title.addEventListener("click", function () {
      const target = document.querySelector(title.getAttribute("data-target"));
      const icon = title.querySelector(".toggle-icon");

      target.style.display =
        target.style.display === "none" || target.style.display === ""
          ? "block"
          : "none";

      icon.classList.toggle("fa-chevron-down");
      icon.classList.toggle("fa-chevron-up");

      // document.querySelectorAll('[data-target^="#main-content-"]').forEach(function (item) {
      //   if (item.getAttribute("data-target") !== title.getAttribute("data-target")) {
      //     item.classList.add("is-not-show");
      //   }
      // });
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
                      <textarea name="" id=""></textarea>
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
  function generateCheckboxes(checkboxName, className, pathName) {
    for (let i = 1; i <= 40; i++) {
      const checkboxItem = document.createElement("div");
      checkboxItem.classList.add(className);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `mp3-${i}`;
      checkbox.value = pathName + `${i}.mp3`;

      const label = document.createElement("label");
      label.htmlFor = `mp3-${i}`;
      label.textContent = `Unit-${i}`;

      checkboxItem.appendChild(checkbox);
      checkboxItem.appendChild(label);
      checkboxName.appendChild(checkboxItem);
    }
  }
  // play audio files sequentially
  function playAudioFilesSequentially(audioFiles) {
    let currentIndex = 0;

    function playNext() {
      if (currentIndex < audioFiles.length) {
        currentAudio = new Audio(audioFiles[currentIndex]);
        currentAudio.play();
        currentAudio.onended = () => {
          currentIndex++;
          playNext();
        };
      }
    }

    playNext();
  }
  function openPdfViewerModal(pdfPath) {
    const pdfViewerModal = new bootstrap.Modal(
      document.getElementById("pdfViewerModal"),
      {
        keyboard: false,
        backdrop: "static",
      }
    );

    PDFJS.getDocument(pdfPath)
      .promise.then((pdf) => {
        const totalPages = pdf.numPages;
        const pdfViewer = document.getElementById("pdfViewer");
        pdfViewer.innerHTML = "";

        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
          pdf.getPage(pageNumber).then((page) => {
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            page.render(renderContext).promise.then(() => {
              pdfViewer.appendChild(canvas);
            });
          });
        }

        pdfViewerModal.show();
      })
      .catch((error) => {
        console.error("Error loading PDF:", error);
        alert("Failed to load PDF. Please try again later.");
      });
  }
  // part 3
  // main content
  const mainContentContainer3 = document.getElementById("main-content-3");
  generalFunction(contentArray3, mainContentContainer3);
  const checkboxList3 = document.querySelector(".checkbox-list-3");
  // generate 40 checkboxes
  generateCheckboxes(checkboxList3, "checkbox-item3", "./libraries/lptd3/");
  // play audio files
  document.getElementById("playButton3").addEventListener("click", () => {
    const selectedCheckboxes3 = document.querySelectorAll(
      ".checkbox-item3 input:checked"
    );

    if (selectedCheckboxes3.length === 0) {
      alert("Please select at least one MP3 file to play.");
      return;
    }

    let audioFiles = [];
    audioFiles = Array.from(selectedCheckboxes3).map(
      (checkbox) => checkbox.value
    );

    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    playAudioFilesSequentially(audioFiles);
  });

  document.getElementById("playAllButton3").addEventListener("click", () => {
    const allCheckboxes = document.querySelectorAll(".checkbox-item3 input");

    let audioFiles = [];
    audioFiles = Array.from(allCheckboxes).map((checkbox) => checkbox.value);

    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    playAudioFilesSequentially(audioFiles);
  });

  document.getElementById("stopButton3").addEventListener("click", () => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
    }
  });
});
