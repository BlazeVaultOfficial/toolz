"use strict";

/* =========================================================
   MEMEFORGE - FULL SCRIPT
   No backend required
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");

const imageUpload = document.getElementById("imageUpload");
const uploadBox = document.getElementById("openImagePicker");

const canvasWidth = document.getElementById("canvasWidth");
const canvasHeight = document.getElementById("canvasHeight");
const applyCanvas = document.getElementById("applyCanvas");

const addTextButton = document.getElementById("addText");
const textControls = document.getElementById("textControls");

const fontFamily = document.getElementById("fontFamily");
const fontSize = document.getElementById("fontSize");
const fontColor = document.getElementById("fontColor");
const outlineSize = document.getElementById("outlineSize");
const outlineColor = document.getElementById("outlineColor");
const textShadow = document.getElementById("textShadow");

const backgroundColor =
    document.getElementById("backgroundColor");

const watermark =
    document.getElementById("watermark");

const watermarkEnabled =
    document.getElementById("watermarkEnabled");

const clearCanvas =
    document.getElementById("clearCanvas");

const resetAll =
    document.getElementById("resetAll");

const downloadMeme =
    document.getElementById("downloadMeme");

const headerDownload =
    document.getElementById("headerDownload");

const randomTemplate =
    document.getElementById("randomTemplate");

const startMaker =
    document.getElementById("startMaker");

const trendingGrid =
    document.getElementById("trendingGrid");

const imageStatus =
    document.getElementById("imageStatus");


/* =========================================================
   IMAGE PICKER ELEMENTS
========================================================= */

const imagePickerModal =
    document.getElementById("imagePickerModal");

const closeImagePicker =
    document.getElementById("closeImagePicker");

const deviceImageButton =
    document.getElementById("deviceImageButton");

const siteImageButton =
    document.getElementById("siteImageButton");

const googleImageButton =
    document.getElementById("googleImageButton");

const siteImagesPanel =
    document.getElementById("siteImagesPanel");

const googleSearchPanel =
    document.getElementById("googleSearchPanel");

const siteImageGrid =
    document.getElementById("siteImageGrid");

const openGoogleSearch =
    document.getElementById("openGoogleSearch");


/* =========================================================
   STATE
========================================================= */

let uploadedImage = null;

let textLayers = [];

let selectedText = null;

let dragState = {
    active: false,
    offsetX: 0,
    offsetY: 0
};


/* =========================================================
   TRENDING 5
========================================================= */

const trendingTemplates = [

    {
        name: "Classic Meme",
        emoji: "😂",
        type: "classic"
    },

    {
        name: "Top & Bottom",
        emoji: "💀",
        type: "topbottom"
    },

    {
        name: "Choice Meme",
        emoji: "👉",
        type: "choice"
    },

    {
        name: "Big Brain",
        emoji: "🧠",
        type: "brain"
    },

    {
        name: "Two Panel",
        emoji: "🔥",
        type: "twopanel"
    }

];


/* =========================================================
   HELPERS
========================================================= */

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}


/* =========================================================
   IMAGE PICKER OPEN
========================================================= */

if (uploadBox) {

    uploadBox.addEventListener("click", () => {

        imagePickerModal.classList.add("active");

        imagePickerModal.setAttribute(
            "aria-hidden",
            "false"
        );

        siteImagesPanel.classList.remove("active");

        googleSearchPanel.classList.remove("active");

    });

}


/* =========================================================
   CLOSE IMAGE PICKER
========================================================= */

function closeImagePickerModal() {

    imagePickerModal.classList.remove("active");

    imagePickerModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


if (closeImagePicker) {

    closeImagePicker.addEventListener(
        "click",
        closeImagePickerModal
    );

}


/* =========================================================
   CLICK OUTSIDE MODAL
========================================================= */

if (imagePickerModal) {

    imagePickerModal.addEventListener(
        "click",
        event => {

            if (
                event.target === imagePickerModal
            ) {

                closeImagePickerModal();

            }

        }
    );

}


/* =========================================================
   ESCAPE CLOSE
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeImagePickerModal();

        }

    }
);


/* =========================================================
   DEVICE IMAGE BUTTON
========================================================= */

if (deviceImageButton) {

    deviceImageButton.addEventListener(
        "click",
        () => {

            imageUpload.click();

        }
    );

}


/* =========================================================
   DEVICE IMAGE UPLOAD
========================================================= */

imageUpload.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];

        if (!file) return;


        if (!file.type.startsWith("image/")) {

            alert(
                "Please select an image file."
            );

            return;

        }


        const reader =
            new FileReader();


        reader.onload = () => {

            const image =
                new Image();


            image.onload = () => {

                uploadedImage = image;


                imageStatus.textContent =
                    "Device image loaded ✓";


                updateUploadButton(
                    "Image Ready ✓"
                );


                drawMeme();

                closeImagePickerModal();

            };


            image.onerror = () => {

                alert(
                    "Could not load this image."
                );

            };


            image.src =
                reader.result;

        };


        reader.readAsDataURL(file);

    }
);


/* =========================================================
   UPDATE UPLOAD BUTTON
========================================================= */

function updateUploadButton(text) {

    if (!uploadBox) return;

    const strong =
        uploadBox.querySelector("strong");

    if (strong) {

        strong.textContent = text;

    }

}


/* =========================================================
   MEMEFORGE IMAGE NAMES
========================================================= */

const siteImages = [];

for (let i = 1; i <= 11; i++) {

    siteImages.push(
        `meme${String(i).padStart(2, "0")}`
    );

}


/* =========================================================
   IMAGE EXTENSIONS
========================================================= */

const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "gif"
];


/* =========================================================
   FIND LOCAL IMAGE
========================================================= */

function findLocalImage(imageName, callback) {

    let index = 0;


    function tryNext() {

        if (
            index >=
            imageExtensions.length
        ) {

            callback(null);

            return;

        }


        const extension =
            imageExtensions[index];

        index++;


        const image =
            new Image();


        image.onload = () => {

            callback(image);

        };


        image.onerror = () => {

            tryNext();

        };


        image.src =
            `meme/${imageName}.${extension}`;

    }


    tryNext();

}


/* =========================================================
   RENDER 11 SITE IMAGES
========================================================= */

function renderSiteImages() {

    if (!siteImageGrid) return;

    siteImageGrid.innerHTML = "";


    siteImages.forEach(
        imageName => {

            const card =
                document.createElement("button");

            card.type = "button";

            card.className = "site-image";


            const image =
                document.createElement("img");

            image.alt = imageName;

            image.loading = "lazy";


            const name =
                document.createElement("div");

            name.className =
                "site-image-name";

            name.textContent =
                imageName.toUpperCase();


            card.appendChild(image);

            card.appendChild(name);

            siteImageGrid.appendChild(card);


            findLocalImage(
                imageName,
                foundImage => {

                    if (foundImage) {

                        image.src =
                            foundImage.src;


                        card.dataset.ready =
                            "true";

                    } else {

                        card.dataset.ready =
                            "false";

                        image.alt =
                            "Image unavailable";

                    }

                }
            );


            card.addEventListener(
                "click",
                () => {

                    if (
                        card.dataset.ready !==
                        "true"
                    ) {

                        alert(
                            `${imageName} was not found in the meme folder.`
                        );

                        return;

                    }


                    loadLocalImage(
                        image.src,
                        imageName
                    );

                }
            );

        }
    );

}


/* =========================================================
   LOAD LOCAL IMAGE
========================================================= */

function loadLocalImage(
    source,
    imageName
) {

    const image =
        new Image();


    image.onload = () => {

        uploadedImage =
            image;


        imageStatus.textContent =
            `${imageName} selected ✓`;


        updateUploadButton(
            `${imageName} Ready ✓`
        );


        drawMeme();

        closeImagePickerModal();

    };


    image.onerror = () => {

        alert(
            "Could not load the selected image."
        );

    };


    image.src = source;

}


/* =========================================================
   SHOW SITE IMAGES
========================================================= */

if (siteImageButton) {

    siteImageButton.addEventListener(
        "click",
        () => {

            googleSearchPanel.classList.remove(
                "active"
            );

            siteImagesPanel.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================================================
   GOOGLE IMAGE OPTION
========================================================= */

if (googleImageButton) {

    googleImageButton.addEventListener(
        "click",
        () => {

            siteImagesPanel.classList.remove(
                "active"
            );

            googleSearchPanel.classList.add(
                "active"
            );

        }
    );

}


/* =========================================================
   OPEN GOOGLE IMAGES
========================================================= */

if (openGoogleSearch) {

    openGoogleSearch.addEventListener(
        "click",
        () => {

            window.open(
                "https://www.google.com/search?tbm=isch",
                "_blank",
                "noopener,noreferrer"
            );

        }
    );

}


/* =========================================================
   CANVAS BACKGROUND
========================================================= */

function drawBackground() {

    ctx.fillStyle =
        backgroundColor.value;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}


/* =========================================================
   DRAW IMAGE AS COVER
========================================================= */

function drawImageCover(image) {

    if (!image) return;


    const canvasRatio =
        canvas.width /
        canvas.height;


    const imageRatio =
        image.width /
        image.height;


    let width;
    let height;


    if (imageRatio > canvasRatio) {

        height =
            canvas.height;

        width =
            height * imageRatio;

    } else {

        width =
            canvas.width;

        height =
            width / imageRatio;

    }


    const x =
        (canvas.width - width) / 2;

    const y =
        (canvas.height - height) / 2;


    ctx.drawImage(
        image,
        x,
        y,
        width,
        height
    );

}


/* =========================================================
   WRAPPED TEXT
========================================================= */

function drawWrappedText(layer) {

    const text =
        layer.text;

    if (!text) return;


    const maxWidth =
        canvas.width * 0.88;


    ctx.font =
        `900 ${layer.size}px "${layer.font}"`;


    const words =
        text.split(/\s+/);


    const lines = [];

    let line = "";


    words.forEach(word => {

        const test =
            line
                ? `${line} ${word}`
                : word;


        if (
            ctx.measureText(test).width >
            maxWidth &&
            line
        ) {

            lines.push(line);

            line = word;

        } else {

            line = test;

        }

    });


    if (line) {

        lines.push(line);

    }


    const lineHeight =
        layer.size * 1.12;


    const totalHeight =
        lines.length * lineHeight;


    let startY =
        layer.y -
        totalHeight / 2 +
        lineHeight / 2;


    lines.forEach(currentLine => {

        drawSingleTextLine(
            layer,
            currentLine,
            layer.x,
            startY
        );


        startY += lineHeight;

    });

}


/* =========================================================
   DRAW SINGLE TEXT LINE
========================================================= */

function drawSingleTextLine(
    layer,
    text,
    x,
    y
) {

    ctx.save();


    ctx.font =
        `900 ${layer.size}px "${layer.font}"`;


    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.lineJoin =
        "round";


    if (layer.shadow) {

        ctx.shadowColor =
            "rgba(0,0,0,0.9)";

        ctx.shadowBlur =
            7;

        ctx.shadowOffsetX =
            3;

        ctx.shadowOffsetY =
            4;

    }


    if (layer.outline > 0) {

        ctx.lineWidth =
            layer.outline;

        ctx.strokeStyle =
            layer.outlineColor;

        ctx.strokeText(
            text,
            x,
            y
        );

    }


    ctx.fillStyle =
        layer.color;


    ctx.fillText(
        text,
        x,
        y
    );


    ctx.restore();

}


/* =========================================================
   DRAW TEXT LAYER
========================================================= */

function drawTextLayer(layer) {

    drawWrappedText(layer);

}


/* =========================================================
   WATERMARK
========================================================= */

function drawWatermark() {

    if (!watermarkEnabled.checked) {
        return;
    }


    const text =
        watermark.value.trim();


    if (!text) return;


    ctx.save();


    const size =
        Math.max(
            18,
            canvas.width * 0.022
        );


    ctx.font =
        `600 ${size}px Arial`;


    ctx.textAlign =
        "right";

    ctx.textBaseline =
        "bottom";


    ctx.fillStyle =
        "rgba(255,255,255,0.72)";


    ctx.shadowColor =
        "rgba(0,0,0,0.8)";

    ctx.shadowBlur =
        5;


    ctx.fillText(
        text,
        canvas.width - 25,
        canvas.height - 20
    );


    ctx.restore();

}


/* =========================================================
   DRAW EVERYTHING
========================================================= */

function drawMeme() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawBackground();


    if (uploadedImage) {

        drawImageCover(
            uploadedImage
        );

    }


    textLayers.forEach(
        layer => {

            drawTextLayer(layer);

        }
    );


    drawWatermark();

}


/* =========================================================
   CREATE TEXT
========================================================= */

function addTextLayer(
    value = "YOUR TEXT",
    x = canvas.width / 2,
    y = canvas.height / 2
) {

    const layer = {

        id:
            Date.now() +
            Math.random(),

        text:
            value,

        x:
            x,

        y:
            y,

        font:
            fontFamily.value,

        size:
            Number(fontSize.value),

        color:
            fontColor.value,

        outline:
            Number(outlineSize.value),

        outlineColor:
            outlineColor.value,

        shadow:
            textShadow.checked

    };


    textLayers.push(layer);

    selectedText =
        layer.id;


    renderTextControls();

    loadSelectedStyle();

    drawMeme();

}


/* =========================================================
   ADD TEXT BUTTON
========================================================= */

addTextButton.addEventListener(
    "click",
    () => {

        addTextLayer(
            "NEW MEME TEXT",
            canvas.width / 2,
            canvas.height / 2
        );

    }
);


/* =========================================================
   TEXT CONTROLS
========================================================= */

function renderTextControls() {

    textControls.innerHTML = "";


    textLayers.forEach(
        (layer, index) => {

            const wrapper =
                document.createElement("div");

            wrapper.className =
                "text-control";


            wrapper.innerHTML = `

                <div class="text-control-top">

                    <b>
                        TEXT ${index + 1}
                    </b>

                    <button
                        type="button"
                        class="remove-text"
                        data-id="${layer.id}"
                    >
                        ×
                    </button>

                </div>

                <textarea
                    class="layer-text"
                    data-id="${layer.id}"
                    placeholder="Type anything..."
                ></textarea>

            `;


            const textarea =
                wrapper.querySelector(
                    ".layer-text"
                );


            textarea.value =
                layer.text;


            textarea.addEventListener(
                "focus",
                () => {

                    selectedText =
                        layer.id;

                    loadSelectedStyle();

                }
            );


            textarea.addEventListener(
                "input",
                event => {

                    layer.text =
                        event.target.value;

                    selectedText =
                        layer.id;

                    drawMeme();

                }
            );


            const removeButton =
                wrapper.querySelector(
                    ".remove-text"
                );


            removeButton.addEventListener(
                "click",
                () => {

                    textLayers =
                        textLayers.filter(
                            item =>
                                item.id !==
                                layer.id
                        );


                    if (
                        selectedText ===
                        layer.id
                    ) {

                        selectedText =
                            null;

                    }


                    renderTextControls();

                    drawMeme();

                }
            );


            textControls.appendChild(
                wrapper
            );

        }
    );

}


/* =========================================================
   LOAD SELECTED TEXT STYLE
========================================================= */

function loadSelectedStyle() {

    const layer =
        textLayers.find(
            item =>
                item.id === selectedText
        );


    if (!layer) return;


    fontFamily.value =
        layer.font;

    fontSize.value =
        layer.size;

    fontColor.value =
        layer.color;

    outlineSize.value =
        layer.outline;

    outlineColor.value =
        layer.outlineColor;

    textShadow.checked =
        layer.shadow;

}


/* =========================================================
   UPDATE SELECTED TEXT STYLE
========================================================= */

function updateSelectedText() {

    const layer =
        textLayers.find(
            item =>
                item.id === selectedText
        );


    if (!layer) {

        drawMeme();

        return;

    }


    layer.font =
        fontFamily.value;

    layer.size =
        Number(fontSize.value);

    layer.color =
        fontColor.value;

    layer.outline =
        Number(outlineSize.value);

    layer.outlineColor =
        outlineColor.value;

    layer.shadow =
        textShadow.checked;


    drawMeme();

}


fontFamily.addEventListener(
    "input",
    updateSelectedText
);

fontFamily.addEventListener(
    "change",
    updateSelectedText
);

fontSize.addEventListener(
    "input",
    updateSelectedText
);

fontColor.addEventListener(
    "input",
    updateSelectedText
);

outlineSize.addEventListener(
    "input",
    updateSelectedText
);

outlineColor.addEventListener(
    "input",
    updateSelectedText
);

textShadow.addEventListener(
    "change",
    updateSelectedText
);


/* =========================================================
   BACKGROUND
========================================================= */

backgroundColor.addEventListener(
    "input",
    drawMeme
);


/* =========================================================
   WATERMARK
========================================================= */

watermark.addEventListener(
    "input",
    drawMeme
);

watermarkEnabled.addEventListener(
    "change",
    drawMeme
);


/* =========================================================
   CANVAS SIZE
========================================================= */

applyCanvas.addEventListener(
    "click",
    () => {

        let width =
            parseInt(canvasWidth.value);

        let height =
            parseInt(canvasHeight.value);


        if (
            !width ||
            !height ||
            width < 200 ||
            height < 200
        ) {

            alert(
                "Canvas size must be at least 200 × 200."
            );

            return;

        }


        width =
            clamp(
                width,
                200,
                3000
            );


        height =
            clamp(
                height,
                200,
                3000
            );


        canvas.width =
            width;

        canvas.height =
            height;


        canvasWidth.value =
            width;

        canvasHeight.value =
            height;


        textLayers.forEach(
            layer => {

                layer.x =
                    clamp(
                        layer.x,
                        0,
                        canvas.width
                    );

                layer.y =
                    clamp(
                        layer.y,
                        0,
                        canvas.height
                    );

            }
        );


        drawMeme();

    }
);


/* =========================================================
   CANVAS POINTER POSITION
   Works for mouse + touch + pen
========================================================= */

function getCanvasPosition(event) {

    const rect =
        canvas.getBoundingClientRect();


    const scaleX =
        canvas.width /
        rect.width;


    const scaleY =
        canvas.height /
        rect.height;


    return {

        x:
            (event.clientX - rect.left)
            * scaleX,

        y:
            (event.clientY - rect.top)
            * scaleY

    };

}


/* =========================================================
   FIND TEXT UNDER POINTER
========================================================= */

function findTextAt(x, y) {

    for (
        let i =
            textLayers.length - 1;

        i >= 0;

        i--
    ) {

        const layer =
            textLayers[i];


        if (!layer.text) continue;


        ctx.save();


        ctx.font =
            `900 ${layer.size}px "${layer.font}"`;


        const maxWidth =
            canvas.width * 0.88;


        const textWidth =
            Math.min(
                ctx.measureText(
                    layer.text
                ).width,
                maxWidth
            );


        ctx.restore();


        const width =
            textWidth / 2;


        const height =
            layer.size * 0.8;


        if (

            x >= layer.x - width &&
            x <= layer.x + width &&
            y >= layer.y - height &&
            y <= layer.y + height

        ) {

            return layer;

        }

    }


    return null;

}


/* =========================================================
   POINTER DOWN
========================================================= */

canvas.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();


        const position =
            getCanvasPosition(event);


        const layer =
            findTextAt(
                position.x,
                position.y
            );


        if (!layer) {

            selectedText =
                null;

            return;

        }


        selectedText =
            layer.id;


        dragState.active =
            true;


        dragState.offsetX =
            position.x - layer.x;


        dragState.offsetY =
            position.y - layer.y;


        loadSelectedStyle();


        canvas.setPointerCapture(
            event.pointerId
        );

    }
);


/* =========================================================
   POINTER MOVE
   IMPORTANT: PREVENT PAGE SCROLL
========================================================= */

canvas.addEventListener(
    "pointermove",
    event => {

        if (!dragState.active)
            return;


        event.preventDefault();


        const layer =
            textLayers.find(
                item =>
                    item.id ===
                    selectedText
            );


        if (!layer)
            return;


        const position =
            getCanvasPosition(event);


        layer.x =
            clamp(
                position.x -
                dragState.offsetX,

                0,

                canvas.width
            );


        layer.y =
            clamp(
                position.y -
                dragState.offsetY,

                0,

                canvas.height
            );


        drawMeme();

    }
);


/* =========================================================
   POINTER UP
========================================================= */

canvas.addEventListener(
    "pointerup",
    event => {

        dragState.active =
            false;


        try {

            canvas.releasePointerCapture(
                event.pointerId
            );

        } catch (error) {

            /* Nothing to do */

        }

    }
);


/* =========================================================
   POINTER CANCEL
========================================================= */

canvas.addEventListener(
    "pointercancel",
    () => {

        dragState.active =
            false;

    }
);


/* =========================================================
   PREVENT CONTEXT MENU ON CANVAS
========================================================= */

canvas.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();

    }
);


/* =========================================================
   CLEAR
========================================================= */

clearCanvas.addEventListener(
    "click",
    () => {

        uploadedImage =
            null;


        imageUpload.value =
            "";


        imageStatus.textContent =
            "No image";


        updateUploadButton(
            "Choose Image"
        );


        textLayers =
            [];


        selectedText =
            null;


        drawMeme();

        renderTextControls();

    }
);


/* =========================================================
   RESET
========================================================= */

resetAll.addEventListener(
    "click",
    () => {

        uploadedImage =
            null;


        imageUpload.value =
            "";


        canvas.width =
            1080;

        canvas.height =
            1080;


        canvasWidth.value =
            1080;

        canvasHeight.value =
            1080;


        backgroundColor.value =
            "#111111";


        watermark.value =
            "";


        watermarkEnabled.checked =
            true;


        fontFamily.value =
            "Arial";


        fontSize.value =
            60;


        fontColor.value =
            "#ffffff";


        outlineSize.value =
            6;


        outlineColor.value =
            "#000000";


        textShadow.checked =
            true;


        imageStatus.textContent =
            "No image";


        updateUploadButton(
            "Choose Image"
        );


        selectedText =
            null;


        textLayers =
            [];


        addTextLayer(
            "WHEN THE MEME IS TOO REAL",
            canvas.width / 2,
            100
        );


        renderTextControls();

        drawMeme();

    }
);


/* =========================================================
   DOWNLOAD PNG
========================================================= */

function downloadMemePNG() {

    drawMeme();


    canvas.toBlob(
        blob => {

            if (!blob) {

                alert(
                    "Could not create image."
                );

                return;

            }


            const url =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href =
                url;


            link.download =
                `memeforge-${Date.now()}.png`;


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            setTimeout(
                () => {

                    URL.revokeObjectURL(
                        url
                    );

                },
                1000
            );

        },
        "image/png"
    );

}


downloadMeme.addEventListener(
    "click",
    downloadMemePNG
);


headerDownload.addEventListener(
    "click",
    downloadMemePNG
);


/* =========================================================
   TRENDING UI
========================================================= */

function renderTrending() {

    if (!trendingGrid)
        return;


    trendingGrid.innerHTML = "";


    trendingTemplates.forEach(
        (template, index) => {

            const card =
                document.createElement("button");


            card.type =
                "button";


            card.className =
                "trending-card";


            card.innerHTML = `

                <div class="trending-number">
                    #0${index + 1}
                </div>

                <div class="trending-emoji">
                    ${template.emoji}
                </div>

                <h3>
                    ${template.name}
                </h3>

                <p>
                    Click to use format
                </p>

            `;


            card.addEventListener(
                "click",
                () => {

                    applyTemplate(
                        template.type
                    );


                    document
                        .getElementById("maker")
                        .scrollIntoView({
                            behavior:
                                "smooth"
                        });

                }
            );


            trendingGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   APPLY TRENDING TEMPLATE
========================================================= */

function applyTemplate(type) {

    textLayers =
        [];


    const W =
        canvas.width;

    const H =
        canvas.height;


    if (type === "classic") {

        addTextLayer(
            "TOP TEXT",
            W / 2,
            H * 0.12
        );


        addTextLayer(
            "BOTTOM TEXT",
            W / 2,
            H * 0.88
        );

    }


    else if (type === "topbottom") {

        addTextLayer(
            "WHEN YOU EXPECT THIS...",
            W / 2,
            H * 0.13
        );


        addTextLayer(
            "...BUT GET THIS 💀",
            W / 2,
            H * 0.87
        );

    }


    else if (type === "choice") {

        addTextLayer(
            "YES",
            W * 0.25,
            H * 0.82
        );


        addTextLayer(
            "ALSO YES",
            W * 0.75,
            H * 0.82
        );

    }


    else if (type === "brain") {

        addTextLayer(
            "NORMAL IDEA",
            W / 2,
            H * 0.18
        );


        addTextLayer(
            "BIG BRAIN IDEA 🧠",
            W / 2,
            H * 0.82
        );

    }


    else if (type === "twopanel") {

        addTextLayer(
            "BEFORE",
            W * 0.25,
            H * 0.15
        );


        addTextLayer(
            "AFTER",
            W * 0.75,
            H * 0.15
        );

    }


    renderTextControls();

    drawMeme();

}


/* =========================================================
   RANDOM TRENDING
========================================================= */

randomTemplate.addEventListener(
    "click",
    () => {

        const randomIndex =
            Math.floor(
                Math.random() *
                trendingTemplates.length
            );


        applyTemplate(
            trendingTemplates[
                randomIndex
            ].type
        );

    }
);


/* =========================================================
   START MAKER
========================================================= */

if (startMaker) {

    startMaker.addEventListener(
        "click",
        () => {

            document
                .getElementById("maker")
                .scrollIntoView({
                    behavior:
                        "smooth"
                });

        }
    );

}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /* Ctrl + S */

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "s"
        ) {

            event.preventDefault();

            downloadMemePNG();

        }


        /* Delete selected text */

        if (
            event.key === "Delete" &&
            selectedText !== null
        ) {

            textLayers =
                textLayers.filter(
                    layer =>
                        layer.id !==
                        selectedText
                );


            selectedText =
                null;


            renderTextControls();

            drawMeme();

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

renderSiteImages();

renderTrending();


addTextLayer(
    "WHEN THE MEME IS TOO REAL",
    canvas.width / 2,
    100
);


renderTextControls();

drawMeme();