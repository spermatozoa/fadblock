const taimuRipu = () => {
  const videoContainer = document.getElementById("movie_player");
  const isAd = videoContainer?.classList.contains("ad-interrupting") || videoContainer?.classList.contains("ad-showing");  
  if(!isAd){ //prevent staticAds for loop run too many times
    return;
  }
  const skipLock = document.querySelector(".ytp-ad-preview-text")?.innerText || document.getElementsByClassName("video-ads")[0]?.childNodes.length > 0;
  const surveyLock = document.querySelector(".ytp-ad-survey")?.length > 0;

  try{
    // document.querySelector(".mgp_videoElement")

    if (skipLock) {
      const videoPlayer = document.getElementsByClassName("video-stream")[0];
      if(videoPlayer.duration){        
        videoPlayer.muted = true; // videoPlayer.volume = 0;
        videoPlayer.currentTime = videoPlayer.duration - 0.1;
        videoPlayer.paused && videoPlayer.play()
      }
      // CLICK ON THE SKIP AD BTN
      document.querySelector(".ytp-ad-skip-button")?.click();
      document.querySelector(".ytp-ad-skip-button-modern")?.click();
    } else if (surveyLock) {
      // CLICK ON THE SKIP SURVEY BTN
      document.querySelector(".ytp-ad-skip-button")?.click();
      document.querySelector(".ytp-ad-skip-button-modern")?.click();
    }
  }
  catch (err){
    console.error(err.message);
    console.log(videoContainer)
    console.log(document.body)
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

let autoConfirmContinue = true;
const ELEMENT_NODE = 1;
const waitVideoCallback = (mutationList) => {    
  for (const mutation of mutationList){ 
    if (mutation.type === "childList" && mutation.target.nodeType == ELEMENT_NODE){
      if(mutation.target.id=="movie_player"){
        ObserverForYTPage.disconnect()
        let node = document.querySelector("#movie_player");
        trySetObserver(ObserverForAd, node);
        // if(autoConfirmContinue){
        //   let n = document.querySelector("ytd-popup-container");
        //   trySetObserver(ObserverForContinue, n);
        // }
      }
    }
  }
};

const byeAdCallback = (mutationList) => {    
  for (const mutation of mutationList){ 
    if (mutation.type === "childList" && mutation.target.nodeType == ELEMENT_NODE){
      // if(mutation.target.classList.contains("video-ads") && mutation.target.childNodes.length > 0){}
      taimuRipu();
    }
  }
};

const confirmContinueCallback = (mutationList) => {    
  for (const mutation of mutationList){ 
    if (mutation.type === "childList" && mutation.target.nodeType == ELEMENT_NODE){
      if(mutation.target.id=="confirm-button"){
        document.querySelector("#confirm-button button")?.click();
      }
    }
  }
};

const ObserverForYTPage = new MutationObserver(waitVideoCallback);
const ObserverForAd = new MutationObserver(byeAdCallback);
const ObserverForContinue = new MutationObserver(confirmContinueCallback);

const activateObserver = (observer, node) => {      
  observer.observe(node, {
      // attributes: true,
      subtree: true,
      childList: true,
  });
}

const trySetObserver = (observer, node, retry_times = 10) => {
  if(retry_times == 0) {
      console.error("trying to start fadblock(observer) failed.\nprevent futher attemption");
  }
  else{
      try{
          activateObserver(observer, node);
      }
      catch(err){
          console.debug(err.message, flag);
          setTimeout(trySetObserver, 100, observer, node, retry_times - 1);
      }
  }
}

const init = () => {
  Document.prototype.hideElementsBySelector = (selector) =>
    [...document.querySelectorAll(selector)].forEach(
      (el) => (el.style.display = "none")
    );

    // taimuRipu();
    let n = document.getElementById("movie_player");
    if(n){
      trySetObserver(ObserverForAd, n);
    }
    else{
      let nodeName = "ytd-page-manager";
      let node = document.querySelector(nodeName);
      trySetObserver(ObserverForYTPage, node);
    }
};

init();
console.log(3);