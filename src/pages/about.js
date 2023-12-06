import React, { Fragment, useEffect, useRef, useState } from "react";
import { languageList } from "../utility/utlis";

const About = () => {
  const mapRef = useRef(null);
  const panelRef = useRef(null);
  // const DetailRef = useRef(null);
  const langList = languageList();
  const panel = document.getElementById("panelPlace");
  panelRef.current = panel;
  const apiKey = process.env.REACT_APP_API_KEY;
  const [language, setLanguage] = useState(langList[0]?.value);
  // const authentication = ApiKeyManager.fromKey(apiKey);
  const [isShowDetails, setisShowDetails] = useState(false);

  useEffect(() => {
    const loadScript = (url, onLoad) => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = url;
      script.async = true;
      script.onload = onLoad;
      document.head.appendChild(script);
    };

    const loadMap = () => {
      const map = new window.maplibregl.Map({
        container: mapRef.current,
        style: `https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/arcgis/navigation?token=${apiKey}&language=${language}`,
        zoom: 5,
        center: [72.53, 23.065],
      });

      map.once("load", () => {
        map.on("mousemove", function (e) {
          const features = map.queryRenderedFeatures(e.point);
          if (features.length && features[0].properties.esri_place_id) {
            map.getCanvas().style.cursor = "pointer";

            showPopup(features[0]);
          } else {
            map.getCanvas().style.cursor = "";
          }
        });

        map.on("click", function (e) {
          const features = map.queryRenderedFeatures(e.point);
          if (features.length && features[0].properties.esri_place_id) {
            map.flyTo({ center: features[0].geometry.coordinates });
            setisShowDetails(true);
            showPlaceDetails(features[0]);
          }
        });

        const popup = new window.maplibregl.Popup({
          closeButton: true,
          closeOnClick: false,
        });
        popup.setMaxWidth("350");

        const showPopup = (feature) => {
          popup.setLngLat(feature.geometry.coordinates);

          popup
            .setHTML(
              `<b>Name</b>: ${feature.properties.name}</br>
            <b>Place ID</b>: ${feature.properties.esri_place_id}</br>`
            )
            .addTo(map);
        };

        const showPlaceDetails = (feature) => {
          // const placeID = feature.properties.esri_place_id;
          // getPlaceDetails({
          //   placeId: placeID,
          //   requestedFields: "all",
          //   authentication,
          // })
          //   .then((result) => {
          //     console.log("__result", result);
          setPlaceDetails({
            name: "Dolphin web solution",
            address: {
              streetAddress:
                "Dolphin web solution, Empire Business Hub, sceince city road, ahmedabad.",
            },
            contactInfo: {
              telephone: "9867892309",
              email: "dolphinwebsolution@gmail.com",
              website: "https://dolphinwebsolution.com/",
            },
            hours: {
              openingText:
                "Mon-Fri 12:00 AM-1:10 AM, 4:30 AM-11:59 PM; Sat-Sun 12:00 AM-2:30 AM, 4:30 AM-11:59 PM",
            },
            rating: {
              user: "1000",
            },
            socialMedia: {
              facebookId: "dolphinwebsol",
              twitter: "dolphinwebsol",
              instagram: "dolphinweb",
            },
          });
          // })
        };

        const setPlaceDetails = (placeDetails) => {
          if (placeDetails?.name !== null) {
            panelRef?.current?.setAttribute("heading", placeDetails?.name);
          }

          setElementProperties(
            "addressLabel",
            placeDetails?.address?.streetAddress
          );
          setElementProperties(
            "phoneLabel",
            placeDetails?.contactInfo?.telephone
          );
          setElementProperties("hoursLabel", placeDetails?.hours?.openingText);
          setElementProperties("ratingLabel", placeDetails?.rating?.user);
          setElementProperties("emailLabel", placeDetails?.contactInfo?.email);
          setElementProperties(
            "websiteLabel",
            placeDetails?.contactInfo?.website
              ?.replace(/^https?:\/\//, "")
              .replace(/\/$/, "")
          );
          setElementProperties(
            "facebookLabel",
            placeDetails?.socialMedia?.facebookId
              ? `www.facebook.com/${placeDetails.socialMedia.facebookId}`
              : null
          );
          setElementProperties(
            "twitterLabel",
            placeDetails?.socialMedia?.twitter
              ? `www.twitter.com/${placeDetails.socialMedia.twitter}`
              : null
          );
          setElementProperties(
            "instagramLabel",
            placeDetails?.socialMedia?.instagram
              ? `www.instagram.com/${placeDetails.socialMedia.instagram}`
              : null
          );
          // mapContainerRef?.current?.appendChild(DetailRef.current);
          // DetailRef.current.style.position = "absolute";
          // DetailRef.current.style.top = "10px"; // Adjust as needed
          // DetailRef.current.style.right = "10px"; // Adjust as needed

          panelRef?.current?.addEventListener("calcitePanelClose", function () {
            setisShowDetails(false);
          });
        };

        const setElementProperties = (id, validValue) => {
          const element = document.getElementById(id);
          if (element !== null) {
            if (validValue) {
              element.classList.remove("hide");
              element.description = validValue;
            } else {
              element.classList.add("hide");
              element.description = "";
            }
          }
        };
      });
    };

    // Load maplibre-gl script
    loadScript(
      "https://unpkg.com/maplibre-gl@2.1.9/dist/maplibre-gl.js",
      loadMap
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);
  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1000,
          }}
        >
          <calcite-combobox
            id="styleCombobox"
            selection-mode="single"
            clear-disabled
            onClick={(e) => {
              handleLanguageChange(e.target.value);
            }}
          >
            {langList &&
              langList.map((item, i) => (
                <Fragment key={i}>
                  <calcite-combobox-item
                    value={item.value}
                    text-label={item.label}
                  ></calcite-combobox-item>
                </Fragment>
              ))}
          </calcite-combobox>
        </div>
        <div ref={mapRef} style={{ width: "100%", height: "500px" }}></div>
        {isShowDetails && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              height: "80%",
              textAlign: "left",
            }}
          >
            <calcite-panel id="panelPlace">
              <calcite-block
                id="addressLabel"
                class="hide"
                heading="Address"
                scale="l"
                description=""
              >
                <calcite-icon
                  scale="m"
                  slot="icon"
                  icon="map-pin"
                ></calcite-icon>
              </calcite-block>
              <calcite-block
                id="phoneLabel"
                class="hide"
                heading="Phone"
                scale="l"
                description=""
              >
                <calcite-icon
                  scale="m"
                  slot="icon"
                  icon="mobile"
                ></calcite-icon>
              </calcite-block>
              <calcite-block
                id="hoursLabel"
                class="hide"
                heading="Hours"
                scale="l"
                description=""
              >
                <calcite-icon scale="m" slot="icon" icon="clock"></calcite-icon>
              </calcite-block>
              <calcite-block
                id="ratingLabel"
                class="hide"
                heading="Rating"
                scale="l"
                description=""
              >
                <calcite-icon scale="m" slot="icon" icon="star"></calcite-icon>
              </calcite-block>
              <calcite-block
                id="emailLabel"
                class="hide"
                heading="Email"
                scale="l"
                description=""
              >
                <calcite-icon
                  scale="m"
                  slot="icon"
                  icon="email-address"
                ></calcite-icon>
                <calcite-action
                  slot="control"
                  text="Information"
                ></calcite-action>
              </calcite-block>
              <calcite-block
                id="websiteLabel"
                class="hide"
                heading="Website"
                scale="l"
                description=""
              >
                <calcite-icon
                  scale="m"
                  slot="icon"
                  icon="information"
                ></calcite-icon>
                <calcite-action
                  slot="control"
                  text="Information"
                ></calcite-action>
              </calcite-block>
              <calcite-block
                id="facebookLabel"
                class="hide"
                heading="Facebook"
                scale="l"
                description=""
              >
                <calcite-icon
                  scale="m"
                  slot="icon"
                  icon="speech-bubble-social"
                ></calcite-icon>
                <calcite-action
                  slot="control"
                  text="Information"
                ></calcite-action>
              </calcite-block>
              <calcite-block
                id="twitterLabel"
                class="hide"
                heading="Twitter"
                scale="l"
                description=""
              >
                <calcite-icon
                  scale="m"
                  slot="icon"
                  icon="speech-bubbles"
                ></calcite-icon>
                <calcite-action
                  slot="control"
                  text="Information"
                ></calcite-action>
              </calcite-block>
              <calcite-block
                id="instagramLabel"
                class="hide"
                heading="Instagram"
                scale="l"
                description=""
              >
                <calcite-icon
                  scale="m"
                  slot="icon"
                  icon="camera"
                ></calcite-icon>
                <calcite-action
                  slot="control"
                  text="Information"
                ></calcite-action>
              </calcite-block>
            </calcite-panel>
          </div>
        )}
      </div>
    </>
  );
};

export default About;
