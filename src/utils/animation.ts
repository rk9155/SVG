import * as fabric from "fabric";

export const animation = (
  type: string,
  fabricCanvas: React.MutableRefObject<fabric.Canvas>
) => {
  const fabricObj = fabricCanvas.current.getObjects()[0]; // Assuming we animate the first object

  switch (type) {
    case "fade":
      fabricObj.set("opacity", 0);
      fabric.util.animate({
        startValue: 0,
        endValue: 1,
        duration: 1000,
        onChange: function (value) {
          fabricObj.set("opacity", value);
          fabricCanvas.current.renderAll();
        },
        onComplete: function () {
          console.log("Fade animation complete");
        },
      });
      break;

    case "float":
      fabric.util.animate({
        startValue: fabricObj.get("top"),
        endValue: fabricObj.get("top") - 50,
        duration: 1000,
        onChange: function (value) {
          fabricObj.set("top", value);
          fabricCanvas.current.renderAll();
        },
        onComplete: function () {
          fabric.util.animate({
            startValue: fabricObj.get("top"),
            endValue: fabricObj.get("top") + 50,
            duration: 1000,
            onChange: function (value) {
              fabricObj.set("top", value);
              fabricCanvas.current.renderAll();
            },
          });
        },
      });
      break;

    case "zoom-in":
      fabricObj.set("scaleX", 0.1);
      fabricObj.set("scaleY", 0.1);
      fabric.util.animate({
        startValue: 0.1,
        endValue: 1,
        duration: 1000,
        onChange: function (value) {
          fabricObj.set("scaleX", value);
          fabricObj.set("scaleY", value);
          fabricCanvas.current.renderAll();
        },
        onComplete: function () {
          console.log("Zoom-in animation complete");
        },
      });
      break;

    case "drop":
      const originalTop = fabricObj.get("top");
      fabricObj.set("top", -100);
      fabric.util.animate({
        startValue: -100,
        endValue: originalTop,
        duration: 1000,
        onChange: function (value) {
          fabricObj.set("top", value);
          fabricCanvas.current.renderAll();
        },
        onComplete: function () {
          console.log("Drop animation complete");
        },
      });
      break;

    case "slide":
      const originalLeft = fabricObj.get("left");
      fabricObj.set("left", -200);
      fabric.util.animate({
        startValue: -200,
        endValue: originalLeft,
        duration: 1000,
        onChange: function (value) {
          fabricObj.set("left", value);
          fabricCanvas.current.renderAll();
        },
        onComplete: function () {
          console.log("Slide animation complete");
        },
      });
      break;

    case "wipe":
      const originalOpacity = fabricObj.get("opacity");
      fabricObj.set("opacity", 0);
      fabric.util.animate({
        startValue: 0,
        endValue: originalOpacity,
        duration: 1000,
        onChange: function (value) {
          fabricObj.set("opacity", value);
          fabricCanvas.current.renderAll();
        },
        onComplete: function () {
          console.log("Wipe animation complete");
        },
      });
      break;

    case "pop":
      fabricObj.set("scaleX", 1);
      fabricObj.set("scaleY", 1);
      fabric.util.animate({
        startValue: 1,
        endValue: 1.5,
        duration: 500,
        onChange: function (value) {
          fabricObj.set("scaleX", value);
          fabricObj.set("scaleY", value);
          fabricCanvas.current.renderAll();
        },
        onComplete: function () {
          fabric.util.animate({
            startValue: 1.5,
            endValue: 1,
            duration: 500,
            onChange: function (value) {
              fabricObj.set("scaleX", value);
              fabricObj.set("scaleY", value);
              fabricCanvas.current.renderAll();
            },
          });
        },
      });
      break;

    case "bounce":
      const bounceHeight = 50;
      const bounceCount = 4;
      let bounceIndex = 0;

      function bounce() {
        const targetTop =
          bounceIndex % 2 === 0
            ? fabricObj.get("top") - bounceHeight
            : fabricObj.get("top") + bounceHeight;
        fabric.util.animate({
          startValue: fabricObj.get("top"),
          endValue: targetTop,
          duration: 250,
          onChange: function (value) {
            fabricObj.set("top", value);
            fabricCanvas.current.renderAll();
          },
          onComplete: function () {
            bounceIndex++;
            if (bounceIndex < bounceCount) {
              bounce();
            } else {
              console.log("Bounce animation complete");
            }
          },
        });
      }

      bounce();
      break;

    case "spin":
      fabric.util.animate({
        startValue: 0,
        endValue: 360,
        duration: 1000,
        onChange: function (value) {
          fabricObj.set("angle", value);
          fabricCanvas.current.renderAll();
        },
        onComplete: function () {
          console.log("Spin animation complete");
        },
      });
      break;

    case "slide-bounce":
      fabric.util.animate({
        startValue: fabricObj.get("left"),
        endValue: fabricObj.get("left") + 200,
        duration: 500,
        easing: fabric.util.ease.easeInOutBounce,
        onChange: function (value) {
          fabricObj.set("left", value);
          fabricCanvas.current.renderAll();
        },
        onComplete: function () {
          console.log("Slide-bounce animation complete");
        },
      });
      break;

    case "gentle-float":
      fabric.util.animate({
        startValue: fabricObj.get("top"),
        endValue: fabricObj.get("top") - 20,
        duration: 2000,
        onChange: function (value) {
          fabricObj.set("top", value);
          fabricCanvas.current.renderAll();
        },
        onComplete: function () {
          fabric.util.animate({
            startValue: fabricObj.get("top"),
            endValue: fabricObj.get("top") + 20,
            duration: 2000,
            onChange: function (value) {
              fabricObj.set("top", value);
              fabricCanvas.current.renderAll();
            },
            onComplete: function () {
              console.log("Gentle-float animation complete");
            },
          });
        },
      });
      break;

    default:
      console.log("No animation type matched.");
      break;
  }
};
