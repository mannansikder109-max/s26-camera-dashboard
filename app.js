document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const yearElements = $$("[data-year]");
  yearElements.forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const chipGrid = $("#chipGrid");
  if (chipGrid) {
    for (let i = 0; i < 64; i += 1) {
      const pixel = document.createElement("i");
      pixel.style.opacity = `${0.38 + Math.random() * 0.62}`;
      chipGrid.appendChild(pixel);
    }
  }

  const menuToggle = $("#menuToggle");
  const menuClose = $("#menuClose");
  const mobileMenu = $("#mobileMenu");
  const menuBackdrop = $("#menuBackdrop");

  const setMenu = (open) => {
    mobileMenu?.classList.toggle("open", open);
    menuBackdrop?.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    menuToggle?.setAttribute("aria-expanded", String(open));
    mobileMenu?.setAttribute("aria-hidden", String(!open));
  };

  menuToggle?.addEventListener("click", () => setMenu(true));
  menuClose?.addEventListener("click", () => setMenu(false));
  menuBackdrop?.addEventListener("click", () => setMenu(false));

  $$("#mobileMenu a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenu(false);
      closeDialog();
    }
  });

  const pixelGrid = $("#pixelGrid");
  if (pixelGrid) {
    for (let i = 0; i < 64; i += 1) {
      const pixel = document.createElement("span");
      pixel.className = "pixel";
      pixelGrid.appendChild(pixel);
    }
  }

  const modes = {
    native: {
      name: "NATIVE",
      title: "Native 200MP",
      pixel: "0.6 μm",
      output: "200 MP",
      caption: "FULL RESOLUTION ARRAY",
      light: "HIGH DETAIL",
      lightWidth: "92%",
      use: "Daylight / detailed crops",
      description:
        "The full-resolution mode preserves the maximum amount of spatial information. It is best suited to bright scenes, landscapes, architecture, and crops.",
      columns: 8,
      color: "#49d6e9"
    },
    quad: {
      name: "4-IN-1",
      title: "4-in-1 50MP",
      pixel: "1.2 μm",
      output: "50 MP",
      caption: "BALANCED PIXEL GROUPING",
      light: "BALANCED",
      lightWidth: "68%",
      use: "Everyday scenes / balanced detail",
      description:
        "Four neighboring pixels are treated as a group. This balances resolution and light behavior for general photography across changing conditions.",
      columns: 4,
      color: "#a584ff"
    },
    sixteen: {
      name: "16-IN-1",
      title: "16-in-1 12.5MP",
      pixel: "2.4 μm",
      output: "12.5 MP",
      caption: "MAXIMUM LIGHT COLLECTION",
      light: "LOW-LIGHT READY",
      lightWidth: "42%",
      use: "Night scenes / moving subjects",
      description:
        "A larger effective pixel collects more light per output pixel. The trade-off is lower output resolution in exchange for cleaner low-light results.",
      columns: 2,
      color: "#71e7b0"
    }
  };

  const updateBinning = (modeKey) => {
    const mode = modes[modeKey];
    if (!mode || !pixelGrid) return;

    $$(".mode-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.mode === modeKey);
    });

    $("#modeName").textContent = mode.name;
    $("#modeTitle").textContent = mode.title;
    $("#pixelSize").textContent = mode.pixel;
    $("#outputSize").textContent = mode.output;
    $("#gridCaption").textContent = mode.caption;
    $("#lightValue").textContent = mode.light;
    $("#useCase strong").textContent = mode.use;
    $("#modeDescription").textContent = mode.description;
    $("#lightBar").style.width = mode.lightWidth;

    pixelGrid.style.gridTemplateColumns = `repeat(${mode.columns}, 1fr)`;
    pixelGrid.style.gap = modeKey === "native" ? "3px" : modeKey === "quad" ? "5px" : "7px";

    $$(".pixel", pixelGrid).forEach((pixel, index) => {
      const active = modeKey === "native" || index % (modeKey === "quad" ? 2 : 4) === 0;
      pixel.style.background = mode.color;
      pixel.style.opacity = active ? "0.9" : "0.22";
      pixel.style.transform = active ? "scale(1)" : "scale(.78)";
    });
  };

  $$(".mode-tab").forEach((tab) => {
    tab.addEventListener("click", () => updateBinning(tab.dataset.mode));
  });

  updateBinning("native");

  const pipelineData = {
    scene: {
      title: "Scene input",
      text: "Light, subject movement, and lens conditions define the raw information entering the system."
    },
    sensor: {
      title: "Sensor conversion",
      text: "Photodiodes convert incoming photons into electrical charge. Pixel grouping can change the effective output strategy."
    },
    isp: {
      title: "ISP processing",
      text: "The image signal processor applies demosaicing, noise reduction, color processing, sharpening, and tone mapping."
    },
    ml: {
      title: "ML / HDR intelligence",
      text: "Multiple frames and learned models can help with dynamic range, detail recovery, subject recognition, and scene rendering."
    },
    output: {
      title: "Final output",
      text: "The result can become a JPEG, HEIF, or—when supported—a RAW/DNG file for further editing."
    }
  };

  const dialog = $("#infoDialog");
  const dialogTitle = $("#dialogTitle");
  const dialogText = $("#dialogText");

  function closeDialog() {
    if (dialog?.open) dialog.close();
  }

  $$(".pipeline-step").forEach((step) => {
    step.addEventListener("click", () => {
      const data = pipelineData[step.dataset.step];
      if (!data) return;

      $$(".pipeline-step").forEach((item) => item.classList.remove("active"));
      step.classList.add("active");

      $("#pipelineTitle").textContent = data.title;
      $("#pipelineDescription").textContent = data.text;

      if (dialog && typeof dialog.showModal === "function") {
        dialogTitle.textContent = data.title;
        dialogText.textContent = data.text;
        dialog.showModal();
      }
    });
  });

  $("#dialogClose")?.addEventListener("click", closeDialog);

  dialog?.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!inside) closeDialog();
  });
});
