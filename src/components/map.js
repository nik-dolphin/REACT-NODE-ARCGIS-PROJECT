import React, { useEffect, useRef, useState } from "react";
import { loadModules } from "esri-loader";

const Map = () => {
  const MapElement = useRef(null);
  const SelectBaseLayerElement = useRef(null);
  const [baseMapId, setBaseMapId] = useState("arcgis-topographic");
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    if (apiKey) {
      loadModules(
        [
          "esri/views/MapView",
          "esri/Map",
          "esri/config",
          "esri/Graphic",
          "esri/tasks/Locator",
          "esri/widgets/Search",
        ],
        {
          css: true,
        }
      ).then(([MapView, Map, esriConfig, Graphic, Locator, Search]) => {
        esriConfig.apiKey = apiKey;
        esriConfig.locale = "fr";
        const locator = new Locator({
          url: "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer",
        });
        const map = new Map({
          basemap: baseMapId, // "arcgis-topographic", // "arcgis-light-gray", // "arcgis-imagery"
          portalItem: {
            id: "d7e8cd6ae3854af6b2ed3a34609b8165",
          },
        });
        const view = new MapView({
          map: map,
          center: [72.805, 23.027],
          zoom: 10,
          container: MapElement.current,
          constraints: {
            snapToZoom: false,
          },
        });
        const search = new Search({
          sources: [
            {
              locator: locator,
              singleLineFieldName: "SingleLine",
              outFields: ["Addr_type"],
              name: "Custom Geocoding Service",
              placeholder: "Enter address",
            },
          ],
          view: view,
        });
        view.ui.add(SelectBaseLayerElement.current, "top-right");
        view.ui.add(search, "top-right");

        view.popup.actions = [
          {
            title: "Custom Action",
            id: "custom-action",
            className: "esri-icon-link",
          },
        ];

        // Listen for the trigger action event
        view.popup.on("trigger-action", (event) => {
          if (event.action.id === "custom-action") {
            // Handle the custom action here
            console.log("Custom action clicked!");
          }
        });

        view.when(() => {
          const params = {
            address: {
              address: "Empire Business Hub, Science City Road, Ahmedabad",
            },
          };

          function showResult(results) {
            if (results.length) {
              const result = results[0];
              view.graphics.add(
                new Graphic({
                  symbol: {
                    type: "simple-marker",
                    color: "#000000",
                    size: "8px",
                    outline: {
                      color: "#ffffff",
                      width: "1px",
                    },
                  },
                  geometry: result.location,
                  attributes: {
                    title: "Address",
                    address: result.address,
                    score: result.score,
                  },
                  popupTemplate: {
                    title: "{title}",
                    content:
                      result.address +
                      "<br><br>" +
                      result.location.longitude.toFixed(5) +
                      "," +
                      result.location.latitude.toFixed(5),
                  },
                })
              );

              const popup = {
                title: result.address,
                content:
                  result.address +
                  "<br><br>" +
                  result.location.longitude.toFixed(5) +
                  "," +
                  result.location.latitude.toFixed(5),
              };

              view.popup.open(popup, result.location);

              view.goTo({
                target: result.location,
                zoom: 13,
              });
            }
          }

          locator.addressToLocations(params).then((results) => {
            showResult(results);
          });
        });
      });
    }
  }, [apiKey, baseMapId]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ height: 600, width: 1000 }} ref={MapElement}></div>
      <div
        id="basemaps-wrapper"
        className="esri-widget"
        ref={SelectBaseLayerElement}
      >
        {/* <calcite-label>Basemap style</calcite-label> */}
        <calcite-combobox
          id="styleCombobox"
          selection-mode="single"
          clear-disabled
          onClick={(e) => {
            setBaseMapId(e.target.value);
          }}
        >
          <calcite-combobox-item
            value="topo-vector"
            text-label="Topo Vector"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis-imagery"
            text-label="ArcGIS Imagery"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/navigation"
            text-label="arcgis/navigation"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/navigation-night"
            text-label="arcgis/navigation-night"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/streets"
            text-label="arcgis/streets"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/streets-relief"
            text-label="arcgis/streets-relief"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/streets-night"
            text-label="arcgis/streets-night"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/outdoor"
            text-label="arcgis/outdoor"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/imagery"
            text-label="arcgis/imagery"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis-topographic"
            text-label="arcgis/topographic"
            selected
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/terrain"
            text-label="arcgis/terrain"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/oceans"
            text-label="arcgis/oceans"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/light-gray"
            text-label="arcgis/light-gray"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/dark-gray"
            text-label="arcgis/dark-gray"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/human-geography"
            text-label="arcgis/human-geography"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/human-geography-dark"
            text-label="arcgis/human-geography-dark"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/charted-territory"
            text-label="arcgis/charted-territory"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/colored-pencil"
            text-label="arcgis/colored-pencil"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/nova"
            text-label="arcgis/nova"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/modern-antique"
            text-label="arcgis/modern-antique"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/midcentury"
            text-label="arcgis/midcentury"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="arcgis/newspaper"
            text-label="arcgis/newspaper"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="osm/standard"
            text-label="osm/standard"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="osm/standard-relief"
            text-label="osm/standard-relief"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="osm/navigation"
            text-label="osm/navigation"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="osm/navigation-dark"
            text-label="osm/navigation-dark"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="osm/streets"
            text-label="osm/streets"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="osm/hybrid"
            text-label="osm/hybrid"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="osm/light-gray"
            text-label="osm/light-gray"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="osm/dark-gray"
            text-label="osm/dark-gray"
          ></calcite-combobox-item>
          <calcite-combobox-item
            value="osm/blueprint"
            text-label="osm/blueprint"
          ></calcite-combobox-item>
        </calcite-combobox>
      </div>
    </div>
  );
};

export default Map;
