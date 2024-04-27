// ==UserScript==
// @name        fadblock-for-safari
// @description This is your new file, start writing code
// @match       *://*.youtube.com/*
// ==/UserScript==

// Source: https://raw.githubusercontent.com/0x48piraj/fadblock/master/src/chrome/js/content.js

const taimuRipu = () => {
  const videoContainer = document.getElementById("movie_player");
  const isAd = videoContainer?.classList.contains("ad-interrupting") || videoContainer?.classList.contains("ad-showing");
  const skipLock = document.querySelector(".ytp-ad-preview-text")?.innerText || document.getElementsByClassName("video-ads")[0]?.childNodes.length > 0;
  const surveyLock = document.querySelector(".ytp-ad-survey")?.length > 0;
  
  if (isAd && skipLock) {
    const videoPlayer = document.getElementsByClassName("video-stream")[0];
    videoPlayer.muted = true; // videoPlayer.volume = 0;
    videoPlayer.currentTime = videoPlayer.duration - 0.1;
    videoPlayer.paused && videoPlayer.play()
    // CLICK ON THE SKIP AD BTN
    document.querySelector(".ytp-ad-skip-button")?.click();
    document.querySelector(".ytp-ad-skip-button-modern")?.click();
  } else if (isAd && surveyLock) {
    // CLICK ON THE SKIP SURVEY BTN
    document.querySelector(".ytp-ad-skip-button")?.click();
    document.querySelector(".ytp-ad-skip-button-modern")?.click();
  }
  const staticAds = [".ytd-companion-slot-renderer", ".ytd-action-companion-ad-renderer", // in-feed video ads
                       ".ytd-watch-next-secondary-results-renderer.sparkles-light-cta", ".ytd-unlimited-offer-module-renderer", // similar components
                       ".ytp-ad-overlay-image", ".ytp-ad-text-overlay", // deprecated overlay ads (04-06-2023)
                       "div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint", "div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer",
                       ".ytd-display-ad-renderer", ".ytd-statement-banner-renderer", ".ytd-in-feed-ad-layout-renderer", // homepage ads
                       "div#player-ads.style-scope.ytd-watch-flexy, div#panels.style-scope.ytd-watch-flexy", // sponsors
                       ".ytd-banner-promo-renderer", ".ytd-video-masthead-ad-v3-renderer", ".ytd-primetime-promo-renderer" // subscribe for premium & youtube tv ads
                      ];

  staticAds.forEach((ad) => {
      document.hideElementsBySelector(ad);
  });
}

const mutationCallback = (mutationList) => {    
  for (const mutation of mutationList){ 
    if (mutation.type === "childList"){  
      taimuRipu();
    }
  }
};
const ObserverForAd = new MutationObserver(mutationCallback);

const activateObserver = () => {        
  let pm = document.querySelector("ytd-page-manager");
  ObserverForAd.observe(pm, {
      subtree: true,
      childList: true,
  });
}

const trySetObserver = (retry_times = 10) => {
  if(retry_times == 0) {
      console.error("trying to start fadblock(observer) failed.\nprevent futher attemption");
  }
  else{
      try{
          activateObserver();
      }
      catch(err){
          console.debug(err.message, flag);
          setTimeout(trySetObserver, 100, retry_times - 1);
      }
  }
}

const init = () => {
  Document.prototype.hideElementsBySelector = (selector) =>
    [...document.querySelectorAll(selector)].forEach(
      (el) => (el.style.display = "none")
    );

    // taimuRipu();
    trySetObserver();
};

init();