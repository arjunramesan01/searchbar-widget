import { isLive } from "../constants/constants";
import { setCookies, getCookie } from "cookies-next";


export function triggerAnalytics(type, index, docId) {
  setCookies("flow_type", type, { maxAge: 60 * 60 * 24, sameSite: "none", secure: true });
  setCookies("flow_index", index, { maxAge: 60 * 60 * 24, sameSite: "none", secure: true });
  setCookies("docId", docId, { maxAge: 60 * 60 * 24, sameSite: "none", secure: true });
}

export function removeOptions(input) {
  if (input) {
    try {
      var output = input.replace(/\s*<ul[^>]*>[\S\s]*?<\/ul>\s*/, "");
      output = output.replace(/\s*<ol[^>]*>[\S\s]*?<\/ol>\s*/, "");
      output = replaceS3(output);
    } catch (err) {
      return output;
    }
    return output;
  }

  return input;
}
export function get_suggestions(text, doc_id, userId) {
  return fetch("/question-answer/api/get_suggestions/", { //TODO: Update Endpoint
    method: "POST", 
    body: JSON.stringify({ text: text, doc_id: doc_id, userid: userId }),
  });
}

export function getSearchHistory(limit) {
  var dataToSend = {
    userToken: getCookie("userToken"),
    limit: limit,
  };
  return fetch("/question-answer/api/questions_by_user/", {
    method: "POST",
    body: JSON.stringify(dataToSend),
  });
}

export function replaceS3(input) {
    if (input) {
      try {
        var output = "";
        if (isLive) {
          output = input.replace(
            /https:\/\/meritnation-question-images.s3.ap-southeast-1.amazonaws.com/g,
            "https://search-static.byjusweb.com/question-images"
          );
        } else {
          output = input.replace(
            /https:\/\/meritnation-question-images.s3.ap-southeast-1.amazonaws.com/g,
            "https://search-static-stg.byjusweb.com/question-images"
          );
        }
        output = output.replace(/<div>&#xA0;<\/div>/g, "");
        output = output.replace(/<p>&#xA0;<\/p>/g, "");
        output = output.replace(/<span>&#xA0;<\/span>/g, "");
        output = output.replace(/<div>&#xA0;<\/div>/g, "");
        output = output.replace(/<br\/><br\/>/g, "<br/>");
        output = output.replace(/<br><br><br>/g, "<br>");
        output = output.replace(/<br><br>/g, "<br>");
        output = output.replace(/&nbsp;/g, " ");
        output = output.replace(/&#xA0;/g, " ");
        output = output.replace(/<em>/g, "");
        var re = new RegExp(String.fromCharCode(160), "g");
        output = output.replace(re, " ");
      } catch (err) {
        return input;
      }
  
      try {
        var characters = output.split("");
        var urls = [];
  
        for (var i = 0; i < characters.length; i++) {
          if (
            characters[i] == "s" &&
            characters[i + 1] == "r" &&
            characters[i + 2] == "c" &&
            characters[i + 3] == "="
          ) {
            var j = i + 5;
            var found = false;
            var url = "";
            while (!found) {
              if (characters[j] == '"') {
                found = true;
                break;
              }
              url += characters[j];
              j++;
            }
            urls.push(url);
          }
        }
        for (var i = 0; i < urls.length; i++) {
          var toReplace = urls[i].split("https://")[1];
          var goodString = toReplace.replace("//", "/");
          output = output.replace(toReplace, goodString);
        }
      } catch (err) {
        return output;
      }
  
      return output;
    }
  
    return input;
  }