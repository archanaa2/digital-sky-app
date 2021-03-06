import applicationProperties from "../helpers/applicationPropertiesHelper";

import { fromLonLat } from "ol/proj";

export const userAirspaceCategoryService = {
  loadAirspaceCategories
};

function loadAirspaceCategories() {
  const apiRoot = applicationProperties().apiRoot;
  const authToken = "Bearer " + localStorage.getItem("accessToken");
  const requestOptions = {
    method: "GET",
    headers: { Authorization: authToken }
  };
  return fetch(apiRoot + "/airspaceCategory/list", requestOptions)
    .then(handleResponse)
    .then(mergeAirspaceCategoriesByType);
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const errors = (data && data.errors) || [data.toString()];
      return Promise.reject(errors);
    }
    return data;
  });
}

function mergeAirspaceCategoriesByType(airspaceCategories) {
  const result = {};
  airspaceCategories.forEach(airspaceCategory => {
    if (airspaceCategory.type === "GREEN") {
      if (result.greenCategories) {
        result.greenCategories.features = [
          ...result.greenCategories.features,
          ...airspaceCategory.geoJson.features
        ];
      } else {
        result.greenCategories = airspaceCategory.geoJson;
      }
    }

    if (airspaceCategory.type === "AMBER") {
      if (result.amberCategories) {
        result.amberCategories.features = [
          ...result.amberCategories.features,
          ...airspaceCategory.geoJson.features
        ];
      } else {
        result.amberCategories = airspaceCategory.geoJson;
      }
    }

    if (airspaceCategory.type === "RED") {
      if (result.redCategories) {
        result.redCategories.features = [
          ...result.redCategories.features,
          ...airspaceCategory.geoJson.features
        ];
      } else {
        result.redCategories = airspaceCategory.geoJson;
      }
    }
  });
  result.greenCategories = changeToMapCoordinates(result.greenCategories);
  result.amberCategories = changeToMapCoordinates(result.amberCategories);
  result.redCategories = changeToMapCoordinates(result.redCategories);
  return result;
}

function changeToMapCoordinates(geoJson) {
  const result = {
    type: "FeatureCollection",
    features: []
  };
  geoJson.features.forEach(feature => {
    const newFeature = {
      type: "Feature",
      geometry: {
        type: feature.geometry.type,
        coordinates: [[]]
      }
    };
    const mapCoordinates = feature.geometry.coordinates[0].map(coordinate => {
      return fromLonLat(coordinate);
    });
    newFeature.geometry.coordinates[0] = mapCoordinates;
    result.features.push(newFeature);
  });
  return result;
}
