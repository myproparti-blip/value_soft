import mongoose from "mongoose";


const ubiApfDirectionSchema = new mongoose.Schema({
    north1: { type: String, default: "" },
    east1: { type: String, default: "" },
    south1: { type: String, default: "" },
    west1: { type: String, default: "" },
    north2: { type: String, default: "" },
    east2: { type: String, default: "" },
    south2: { type: String, default: "" },
    west2: { type: String, default: "" }
}, { _id: false });

const ubiApfCoordinateSchema = new mongoose.Schema({
    latitude: { type: String, default: "" },
    longitude: { type: String, default: "" }
}, { _id: false });

const ubiApfPhotoSchema = new mongoose.Schema({
    elevationImages: [String],
    siteImages: [String]
}, { _id: false });

const ubiApfPdfDetailsSchema = new mongoose.Schema({
   
    // PROPERTY DETAILS
    briefDescriptionOfProperty: { type: String, default: "" },
    locationOfProperty: { type: String, default: "" },
    plotNo: { type: String, default: "" },
    surveyNo: { type: String, default: "" },
    doorNo: { type: String, default: "" },
    taluka: { type: String, default: "" },
    mandal: { type: String, default: "" },
    district: { type: String, default: "" },

    // GENERAL PROPERTY INFO
    cityTown: { type: String, default: "" },
    residentialArea: { type: String, default: "" },
    commercialArea: { type: String, default: "" },
    industrialArea: { type: String, default: "" },
    classificationOfArea: { type: String, default: "" },
    height: { type: String, default: "" },
    urbanRural: { type: String, default: "" },
    mileSemUrban: { type: String, default: "" },
    municipalCorporationAsPer: { type: String, default: "" },

    // BOUNDARY & DIMENSIONS
    boundariesOfTheProperty: { type: String, default: "" },
    northBoundary: { type: String, default: "" },
    southBoundary: { type: String, default: "" },
    eastBoundary: { type: String, default: "" },
    westBoundary: { type: String, default: "" },

    // LAYOUT & MEASUREMENTS
    plotLayoutNo: { type: String, default: "" },
    sNo41: { type: String, default: "" },
    sNo42: { type: String, default: "" },
    sNo9: { type: String, default: "" },
    asPerDeedNo: { type: String, default: "" },
    asPerDeedArea: { type: String, default: "" },

    // CONSTRUCTION DETAILS
    constructionAsPer: { type: String, default: "" },
    panchayatMunicipalitySearchReport: { type: String, default: "" },
    watercoveredUnderSaleDeeds: { type: String, default: "" },
    governmentEnctmentsOrUtilitiesScheduledArea: { type: String, default: "" },

    // APPROVAL & VALIDITY
    dateIssueAndValidityOfApprovedPlan: { type: String, default: "" },
    whetherGenerousOnAuthority: { type: String, default: "" },
    anyOtherCommentsOrAuthorityApprovedPlan: { type: String, default: "" },

    // BUILDING CONSTRUCTION INFO
    buildingConsistenceAs: { type: String, default: "" },
    greyWordCompleted: { type: String, default: "" },
    mrDwyingUnderwaiting: { type: String, default: "" },
    approvedPlaneAssembly: { type: String, default: "" },

    // BUILDING SPECIFICATIONS
    buildingPlan: { type: String, default: "" },
    groundFloorArea: { type: String, default: "" },
    approvedPlan: { type: String, default: "" },

    // VALUATION REPORT DETAILS
    purposeForValuation: { type: String, default: "" },
    dateOfInspection: { type: String, default: "" },
    dateOnWhichValuationIsMade: { type: String, default: "" },
    listOfDocumentsProducedForPerusal: { type: String, default: "" },
    protocolDocuments: { type: String, default: "" },

    // SANCTIONED PLAN
    sanctionedPlanStatus: { type: String, default: "" },
    certificateNumber: { type: String, default: "" },

    // BUILDING COMPLETION
    buildingCompletionCertificate: { type: String, default: "" },
    completionCertificateNo: { type: String, default: "" },
    ownerAddressJointOwners: { type: String, default: "" },
    jointOwnersDeDetailsOfJointOwnership: { type: String, default: "" },

    // APARTMENT BUILDING SECTION (Page 6)
    classificationOfLocality: { type: String, default: "" },
    developmentOfSurroundingAreas: { type: String, default: "" },
    possibilityOfFutureHousingMixing: { type: String, default: "" },
    feasibilityOf1To2Kms: { type: String, default: "" },
    typeOfStructureMaterial: { type: String, default: "" },
    shareOfLand: { type: String, default: "" },
    typeOfUseToWhichItCanBePut: { type: String, default: "" },
    anyUsageRestriction: { type: String, default: "" },
    isPlotInTownPlanning: { type: String, default: "" },
    cornerPlotOrInteriorFacilities: { type: String, default: "" },
    yearOfRoadAvailability: { type: String, default: "" },
    waterRoadAvailableBelowOrAbove: { type: String, default: "" },
    isALandArea: { type: String, default: "" },
    waterSewerageSystem: { type: String, default: "" },

    // VALUATION DETAILS (Page 7)
    assessedOrAdoptedRateForValuation: { type: String, default: "" },
    estimatedRuleOfLand: { type: String, default: "" },
    technicalDetailsOfBuilding: { type: String, default: "" },
    typeOfBuildingVenture: { type: String, default: "" },
    typeOfConstructionLandCeiling: { type: String, default: "" },
    typeOfPropertyVenture: { type: String, default: "" },
    yearOfProperty: { type: String, default: "" },
    residualUseOfBuildingEstimated: { type: String, default: "" },
    carpetAreaMeasurementDetails: { type: String, default: "" },

    // PLOT & AREA DETAILS (Page 5)
    plotAreaNorth: { type: String, default: "" },
    plotAreaSouth: { type: String, default: "" },
    plotAreaEast: { type: String, default: "" },
    plotAreaWest: { type: String, default: "" },
    extentOfArea: { type: String, default: "" },
    plinthArea: { type: String, default: "" },
    technicalDetailsOfStructure: { type: String, default: "" },
    typeOfConstructionFrame: { type: String, default: "" },
    yearOfConstruction: { type: String, default: "" },

    // FLOOR AREA DETAILS (Page 8)
    groundFloorAreaBuiltUp: { type: String, default: "" },
    firstFloor: { type: String, default: "" },
    secondFloor: { type: String, default: "" },
    thirdFloor: { type: String, default: "" },
    fourthFloor: { type: String, default: "" },
    fifthFloor: { type: String, default: "" },
    sixthFloor: { type: String, default: "" },
    seventhFloor: { type: String, default: "" },
    eighthFloor: { type: String, default: "" },
    ninthFloor: { type: String, default: "" },
    tenthFloor: { type: String, default: "" },
    basementFloor: { type: String, default: "" },
    totalCarpetArea: { type: String, default: "" },

    // CONSTRUCTION SPECIFICATIONS (Page 9)
    finishingWorkInProgress: { type: String, default: "" },
    buildingPlanStructured: { type: String, default: "" },
    dateIssueAndValidityOfLayout: { type: String, default: "" },
    approvalAuthority: { type: String, default: "" },
    weatherGenuinessOrAuthenticity: { type: String, default: "" },
    anyOtherComments: { type: String, default: "" },
    specificationConstructionFloorSlab: { type: String, default: "" },
    foundationDescription: { type: String, default: "" },
    basementDescription: { type: String, default: "" },
    superstructureDescription: { type: String, default: "" },
    entranceDoor: { type: String, default: "" },
    otherDoor: { type: String, default: "" },
    windows: { type: String, default: "" },
    flooringShirtingDetails: { type: String, default: "" },
    specialFinish: { type: String, default: "" },
    roofingWeatherproofCourse: { type: String, default: "" },
    drainage: { type: String, default: "" },
    damp: { type: String, default: "" },
    rccFrameOrRccSlab: { type: String, default: "" },
    proposedETPPlantPerPCBNorms: { type: String, default: "" },

    // PLOT CONSTRUCTION & LAYOUT DETAILS
    compoundwall: { type: String, default: "" },
    height: { type: String, default: "" },
    length: { type: String, default: "" },
    typeOfConstruction: { type: String, default: "" },
    electricalInstallationPlot: { type: String, default: "" },
    typeOfWiringPlot: { type: String, default: "" },
    numberOfFittingPoints: { type: String, default: "" },
    farPlugsPlot: { type: String, default: "" },
    sparePlugPlot: { type: String, default: "" },
    anyOtherItemPlot: { type: String, default: "" },
    printingInstallation: { type: String, default: "" },
    numberOfWaterClassAndTapsPlot: { type: String, default: "" },
    noWashBasinsPlot: { type: String, default: "" },
    noUrinalsPlot: { type: String, default: "" },
    noOfBathtubsPlot: { type: String, default: "" },
    waterMeterTapsPlot: { type: String, default: "" },
    anyOtherFixturePlot: { type: String, default: "" },

    // ORNAMENTAL FLOOR & AMENITIES (Page 12) - DETAILED ITEMS
    ornamentalFloor: { type: String, default: "" },
    ornamentalFloorAmount: { type: String, default: "" },
    stuccoVeranda: { type: String, default: "" },
    stuccoVerandaAmount: { type: String, default: "" },
    sheetGrills: { type: String, default: "" },
    sheetGrillsAmount: { type: String, default: "" },
    overheadWaterTank: { type: String, default: "" },
    overheadWaterTankAmount: { type: String, default: "" },
    extraShedPossibleGates: { type: String, default: "" },
    extraShedPossibleGatesAmount: { type: String, default: "" },
    ornamentalTotal: { type: String, default: "" },

    // PART C - AMENITIES (Revised)
    partCAmenities1Description: { type: String, default: "" },
    partCAmenities1AmountInRupees: { type: String, default: "" },
    partCAmenities2Description: { type: String, default: "" },
    partCAmenities2AmountInRupees: { type: String, default: "" },
    partCAmenities3Description: { type: String, default: "" },
    partCAmenities3AmountInRupees: { type: String, default: "" },
    partCAmenities4Description: { type: String, default: "" },
    partCAmenities4AmountInRupees: { type: String, default: "" },
    partCAmenitiesTotal: { type: String, default: "" },

    // PART D - AMENITIES (Revised - Workbeds section)
    partDWorkbeds1Description: { type: String, default: "" },
    partDWorkbeds1AmountInRupees: { type: String, default: "" },
    partDWorkbeds2Description: { type: String, default: "" },
    partDWorkbeds2AmountInRupees: { type: String, default: "" },
    partDWorkbeds3Description: { type: String, default: "" },
    partDWorkbeds3AmountInRupees: { type: String, default: "" },
    partDWorkbeds4Description: { type: String, default: "" },
    partDWorkbeds4AmountInRupees: { type: String, default: "" },
    partDWorbedsTotal: { type: String, default: "" },

    // AMENITIES DETAILED ITEMS FROM SCREENSHOT
    amenitiesGlazedTubAndBed: { type: String, default: "" },
    amenitiesGlazedTubAndBedAmount: { type: String, default: "" },
    amenitiesExteriorStudAndBed: { type: String, default: "" },
    amenitiesExteriorStudAndBedAmount: { type: String, default: "" },
    amenitiesMaritalCeiling: { type: String, default: "" },
    amenitiesMaritalCeilingAmount: { type: String, default: "" },

    // PART E - MISCELLANEOUS (Revised)
    partEMiscellaneous1Description: { type: String, default: "" },
    partEMiscellaneous1AmountInRupees: { type: String, default: "" },
    partEMiscellaneous2Description: { type: String, default: "" },
    partEMiscellaneous2AmountInRupees: { type: String, default: "" },
    partEMiscellaneous3Description: { type: String, default: "" },
    partEMiscellaneous3AmountInRupees: { type: String, default: "" },
    partEMiscellaneous4Description: { type: String, default: "" },
    partEMiscellaneous4AmountInRupees: { type: String, default: "" },
    partEMiscellaneousTotal: { type: String, default: "" },

    // MISCELLANEOUS DETAILED ITEMS FROM SCREENSHOT
    miscellaneousSeparateToiletRoom: { type: String, default: "" },
    miscellaneousSeparateToiletRoomAmount: { type: String, default: "" },
    miscellaneousSeparateLumberRoom: { type: String, default: "" },
    miscellaneousSeparateLumberRoomAmount: { type: String, default: "" },
    miscellaneousSeparateWaterTankSump: { type: String, default: "" },
    miscellaneousSeparateWaterTankSumpAmount: { type: String, default: "" },
    miscellaneousTreesGardening: { type: String, default: "" },
    miscellaneousTreesGardeningAmount: { type: String, default: "" },

    // BUILDING VALUATION DETAILS (Page 11)
    estimatedRepairCostOfConstruction: { type: String, default: "" },
    rateOfConstruction: { type: String, default: "" },
    buildUpAreaInSqft: { type: String, default: "" },
    groundFloorSqft: { type: String, default: "" },
    groundFloorRateOfConstruction: { type: String, default: "" },
    groundFloorValueOfConstruction: { type: String, default: "" },
    secondFloorSqft: { type: String, default: "" },
    secondFloorRateOfConstruction: { type: String, default: "" },
    secondFloorValueOfConstruction: { type: String, default: "" },
    thirdFloorSqft: { type: String, default: "" },
    thirdFloorRateOfConstruction: { type: String, default: "" },
    thirdFloorValueOfConstruction: { type: String, default: "" },
    fourthFloorSqft: { type: String, default: "" },
    fourthFloorRateOfConstruction: { type: String, default: "" },
    fourthFloorValueOfConstruction: { type: String, default: "" },
    fifthFloorSqft: { type: String, default: "" },
    fifthFloorRateOfConstruction: { type: String, default: "" },
    fifthFloorValueOfConstruction: { type: String, default: "" },
    sixthFloorSqft: { type: String, default: "" },
    sixthFloorRateOfConstruction: { type: String, default: "" },
    sixthFloorValueOfConstruction: { type: String, default: "" },
    basementFloorSqft: { type: String, default: "" },
    basementFloorRateOfConstruction: { type: String, default: "" },
    basementFloorValueOfConstruction: { type: String, default: "" },
    carpetAreaInSqft: { type: String, default: "" },
    carpetAreaRateOfConstruction: { type: String, default: "" },
    carpetAreaValueOfConstruction: { type: String, default: "" },

    // EXTRA ITEMS TABLE (Part C)
    extraItemsLand: { type: String, default: "" },
    extraItemsLandAmount: { type: String, default: "" },
    extraItemsBuilding: { type: String, default: "" },
    extraItemsBuildingAmount: { type: String, default: "" },
    extraItemsExtra: { type: String, default: "" },
    extraItemsExtraAmount: { type: String, default: "" },
    extraItemsAmenities: { type: String, default: "" },
    extraItemsAmenitiesAmount: { type: String, default: "" },
    extraItemsMiscellaneous: { type: String, default: "" },
    extraItemsMiscellaneousAmount: { type: String, default: "" },
    extraItemsServices: { type: String, default: "" },
    extraItemsServicesAmount: { type: String, default: "" },
    extraItemsTotalValue: { type: String, default: "" },

    // ELECTRICAL & PLUMBING INSTALLATIONS (Page 11)
    electricalInstallation: { type: String, default: "" },
    typeOfWiring: { type: String, default: "" },
    classOfFittings: { type: String, default: "" },
    numberOfLightPoints: { type: String, default: "" },
    farPlugs: { type: String, default: "" },
    sparePlug: { type: String, default: "" },
    anyOtherElectricalItem: { type: String, default: "" },
    plumbingInstallation: { type: String, default: "" },
    numberOfWaterClassAndTaps: { type: String, default: "" },
    noWashBasins: { type: String, default: "" },
    noUrinals: { type: String, default: "" },
    noOfBathtubs: { type: String, default: "" },
    waterMeterTapsEtc: { type: String, default: "" },
    anyOtherPlumbingFixture: { type: String, default: "" },

    // FIVE FEET AROUND PLOT
    feetAroundPlot: { type: String, default: "" },
    rcMasonryWallsUpToPlinth: { type: String, default: "" },
    aboveRcMasonryWallsExternally: { type: String, default: "" },

    // BUILDING VALUATION EXTRA DETAILS
    estimatedRCCRepairCostOfConstruction: { type: String, default: "" },
    floorAreaSqft: { type: String, default: "" },
    rateOfConstructionPerSqft: { type: String, default: "" },
    valueOfConstruction: { type: String, default: "" },
    rateOfConstructionValues: { type: String, default: "" },

    // SERVICES (Part F)
    services1Description: { type: String, default: "" },
    services1Amount: { type: String, default: "" },
    waterSupplyArrangements: { type: String, default: "" },
    waterSupplyArrangementsAmount: { type: String, default: "" },
    undergroundStorageCapacity: { type: String, default: "" },
    undergroundStorageCapacityAmount: { type: String, default: "" },
    drainageArrangements: { type: String, default: "" },
    drainageArrangementsAmount: { type: String, default: "" },
    compoundWall: { type: String, default: "" },
    compoundWallAmount: { type: String, default: "" },
    siteDevelopment: { type: String, default: "" },
    siteDevelopmentAmount: { type: String, default: "" },
    swimmingPool: { type: String, default: "" },
    swimmingPoolAmount: { type: String, default: "" },
    servicesTotal: { type: String, default: "" },

    // PROPERTY VALUATION NARRATIVE
    abstractOfEntireProperty: { type: String, default: "" },
    partALandAmount: { type: String, default: "" },
    partBBuildingAmount: { type: String, default: "" },
    partCExtraItemsAmount: { type: String, default: "" },
    partDExtraItemsAmount: { type: String, default: "" },
    partEExtraItemsAmount: { type: String, default: "" },
    partFServicesAmount: { type: String, default: "" },
    totalAbstractValue: { type: String, default: "" },

    // FAIR MARKET VALUE OPINION
    fairMarketValueOpinion: { type: String, default: "" },
    fairMarketValueAmount: { type: String, default: "" },
    propertyAnalysisStatement: { type: String, default: "" },
    openMarketValueStatement: { type: String, default: "" },

    // DETAILS OF VALUATION OF BUILDING
    buildingValuationCompoundWall: { type: String, default: "" },
    buildingValuationHeight: { type: String, default: "" },
    buildingValuationLength: { type: String, default: "" },
    buildingValuationTypeOfConstruction: { type: String, default: "" },
    buildingValuationElectricalInstallation: { type: String, default: "" },
    buildingValuationTypeOfWiring: { type: String, default: "" },
    buildingValuationClassOfFittings: { type: String, default: "" },
    buildingValuationNumberOfLightPoints: { type: String, default: "" },
    buildingValuationFarPlugs: { type: String, default: "" },
    buildingValuationSparePlug: { type: String, default: "" },
    buildingValuationAnyOtherElectricalItem: { type: String, default: "" },
    buildingValuationPlumbingInstallation: { type: String, default: "" },
    buildingValuationNumberOfWaterClassAndTaps: { type: String, default: "" },
    buildingValuationNoWashBasins: { type: String, default: "" },
    buildingValuationNoUrinals: { type: String, default: "" },
    buildingValuationNoOfBathtubs: { type: String, default: "" },
    buildingValuationWaterMeterTapsEtc: { type: String, default: "" },
    buildingValuationAnyOtherPlumbingFixture: { type: String, default: "" },

    // PART C - EXTRA ITEMS WITH FLOOR WISE DETAILS
    partCExtraItemsFloorWise: { type: String, default: "" },
    partCExtraItemsGroundFloor: { type: String, default: "" },
    partCExtraItemsServiceFloor: { type: String, default: "" },
    partCExtraItemsFirstFloor: { type: String, default: "" },
    partCExtraItemsSecondFloor: { type: String, default: "" },
    partCExtraItemsThirdFloor: { type: String, default: "" },
    partCExtraItemsFourthFloor: { type: String, default: "" },
    partCExtraItemsFifthFloor: { type: String, default: "" },
    partCExtraItemsSixthFloor: { type: String, default: "" },
    partCExtraItemsBasementFloor: { type: String, default: "" },
    partCExtraItemsCarotyArea: { type: String, default: "" },

    // PART C - EXTRA ITEMS WITH SQFt AND CONSTRUCTION RATES
    partCExtraItemsSqftGroundFloor: { type: String, default: "" },
    partCExtraItemsSqftServiceFloor: { type: String, default: "" },
    partCExtraItemsSqftFirstFloor: { type: String, default: "" },
    partCExtraItemsSqftSecondFloor: { type: String, default: "" },
    partCExtraItemsSqftThirdFloor: { type: String, default: "" },
    partCExtraItemsSqftFourthFloor: { type: String, default: "" },
    partCExtraItemsSqftFifthFloor: { type: String, default: "" },
    partCExtraItemsSqftSixthFloor: { type: String, default: "" },
    partCExtraItemsSqftBasementFloor: { type: String, default: "" },
    partCExtraItemsSqftCarpetArea: { type: String, default: "" },

    // PART C - EXTRA ITEMS CONSTRUCTION RATE
    partCExtraItemsRateGroundFloor: { type: String, default: "" },
    partCExtraItemsRateServiceFloor: { type: String, default: "" },
    partCExtraItemsRateFirstFloor: { type: String, default: "" },
    partCExtraItemsRateSecondFloor: { type: String, default: "" },
    partCExtraItemsRateThirdFloor: { type: String, default: "" },
    partCExtraItemsRateFourthFloor: { type: String, default: "" },
    partCExtraItemsRateFifthFloor: { type: String, default: "" },
    partCExtraItemsRateSixthFloor: { type: String, default: "" },
    partCExtraItemsRateBasementFloor: { type: String, default: "" },
    partCExtraItemsRateCarpetArea: { type: String, default: "" },

    // PART C - EXTRA ITEMS VALUE OF CONSTRUCTION
    partCExtraItemsValueGroundFloor: { type: String, default: "" },
    partCExtraItemsValueServiceFloor: { type: String, default: "" },
    partCExtraItemsValueFirstFloor: { type: String, default: "" },
    partCExtraItemsValueSecondFloor: { type: String, default: "" },
    partCExtraItemsValueThirdFloor: { type: String, default: "" },
    partCExtraItemsValueFourthFloor: { type: String, default: "" },
    partCExtraItemsValueFifthFloor: { type: String, default: "" },
    partCExtraItemsValueSixthFloor: { type: String, default: "" },
    partCExtraItemsValueBasementFloor: { type: String, default: "" },
    partCExtraItemsValueCarpetArea: { type: String, default: "" },

    // AGE OF BUILDING DEPRECIATION
    ageOfBuildingYears: { type: String, default: "" },
    lifeOfBuilding: { type: String, default: "" },
    depreciationPercentage: { type: String, default: "" },
    depreciatedBuildingRate: { type: String, default: "" },

    // LAND VALUATION SECTION
    floorAreaSqftLand: { type: String, default: "" },
    ratePerSqftLand: { type: String, default: "" },
    interior0PercentLand: { type: String, default: "" },
    entranceCanopyArea: { type: String, default: "" },

    // PART A - LAND (Detailed with amounts)
    partALand1Description: { type: String, default: "" },
    partALand1Amount: { type: String, default: "" },
    partALand2Description: { type: String, default: "" },
    partALand2Amount: { type: String, default: "" },
    partALand3Description: { type: String, default: "" },
    partALand3Amount: { type: String, default: "" },
    partALand4Description: { type: String, default: "" },
    partALand4Amount: { type: String, default: "" },
    partALandTotal: { type: String, default: "" },

    // PART B - BUILDING (Detailed)
    partBBuilding1Description: { type: String, default: "" },
    partBBuilding1Amount: { type: String, default: "" },
    partBBuilding2Description: { type: String, default: "" },
    partBBuilding2Amount: { type: String, default: "" },
    partBBuilding3Description: { type: String, default: "" },
    partBBuilding3Amount: { type: String, default: "" },
    partBBuilding4Description: { type: String, default: "" },
    partBBuilding4Amount: { type: String, default: "" },
    partBBuildingTotal: { type: String, default: "" },

    // PART F - SERVICES DETAILS 
    partFServices1Description: { type: String, default: "" },
    partFServices1Amount: { type: String, default: "" },
    partFServices2Description: { type: String, default: "" },
    partFServices2Amount: { type: String, default: "" },
    partFServices3Description: { type: String, default: "" },
    partFServices3Amount: { type: String, default: "" },
    partFServices4Description: { type: String, default: "" },
    partFServices4Amount: { type: String, default: "" },
    partFServices5Description: { type: String, default: "" },
    partFServices5Amount: { type: String, default: "" },

    // ORNAMENTAL SECTION (Extended)
    ornamental1Description: { type: String, default: "" },
    ornamental1Amount: { type: String, default: "" },
    ornamental2Description: { type: String, default: "" },
    ornamental2Amount: { type: String, default: "" },
    ornamental3Description: { type: String, default: "" },
    ornamental3Amount: { type: String, default: "" },
    ornamental4Description: { type: String, default: "" },
    ornamental4Amount: { type: String, default: "" },
    ornamental5Description: { type: String, default: "" },
    ornamental5Amount: { type: String, default: "" },

    // ADDITIONAL BUILDING DETAILS FROM LATEST SCREENSHOT
    ageOfBuildingDescription: { type: String, default: "" },
    lifeOfBuildingYears: { type: String, default: "" },
    depreciationValue: { type: String, default: "" },
    depreciatedRate: { type: String, default: "" },

    // LAND DETAILS (Extended)
    floorAreaDescription: { type: String, default: "" },
    floorAreaSqftValue: { type: String, default: "" },
    floorAreaToSqftFirstFloor: { type: String, default: "" },
    floorAreaBuiltUpCompletion: { type: String, default: "" },
    floorAreaCarpetArea: { type: String, default: "" },
    floorAreaEntranceCanopyArea: { type: String, default: "" },

    // RATES & VALUES (Extended)
    rateOfConstructionPercentage: { type: String, default: "" },
    depreciationPercentageValue: { type: String, default: "" },
    yetOfProperty: { type: String, default: "" },

    // INTERIOR & FINISH DETAILS
    interiorExcellent: { type: String, default: "" },
    interiorGood: { type: String, default: "" },
    interiorPoor: { type: String, default: "" },

    // COMPOUND WALL & FIXTURES
    compoundWallMasonryHeight: { type: String, default: "" },
    compoundWallFenceDetails: { type: String, default: "" },

    // WATER & SANITATION
    waterTankAboveGround: { type: String, default: "" },
    waterTankUnderground: { type: String, default: "" },
    waterTankRCCStorageCapacity: { type: String, default: "" },

    // SITE DEVELOPMENT
    siteDevelopmentDrainageDetails: { type: String, default: "" },
    siteDevelopmentCompoundWallHeight: { type: String, default: "" },
    siteDevelopmentTrees: { type: String, default: "" },

    // FIRST FLOOR AREA SECTIONS
    firstFloorNorthSection: { type: String, default: "" },
    firstFloorSouthSection: { type: String, default: "" },
    firstFloorEastSection: { type: String, default: "" },
    firstFloorWestSection: { type: String, default: "" },

    // ADDITIONAL DEPRECIATION & AGE FIELDS
    ageOfBuildingMonths: { type: String, default: "" },
    totalLifeOfBuilding: { type: String, default: "" },
    remainingLifePercentage: { type: String, default: "" },

    // ADDITIONAL MISSING FIELDS FROM SCREENSHOTS
    portico: { type: String, default: "" },
    porticoAmount: { type: String, default: "" },
    description: { type: String, default: "" },
    land: { type: String, default: "" },
    building: { type: String, default: "" },
    extraItems: { type: String, default: "" },
    amenities: { type: String, default: "" },
    miscellaneous: { type: String, default: "" },
    services: { type: String, default: "" },
    partACarpetArea: { type: String, default: "" },
    partBCarpetArea: { type: String, default: "" },
    partCCarpetArea: { type: String, default: "" },
    partDCarpetArea: { type: String, default: "" },
    partECarpetArea: { type: String, default: "" },
    partFCarpetArea: { type: String, default: "" },

    // ADDITIONAL BUILDING DETAILS
    serviceFloor: { type: String, default: "" },
    serviceFloorSqft: { type: String, default: "" },
    serviceFloorRateOfConstruction: { type: String, default: "" },
    serviceFloorValueOfConstruction: { type: String, default: "" },

    // PARKING & GARAGE DETAILS
    parkingFloorSqft: { type: String, default: "" },
    parkingFloorRateOfConstruction: { type: String, default: "" },
    parkingFloorValueOfConstruction: { type: String, default: "" },

    // STILT FLOOR DETAILS
    stiltFloor: { type: String, default: "" },
    stiltFloorSqft: { type: String, default: "" },
    stiltFloorRateOfConstruction: { type: String, default: "" },
    stiltFloorValueOfConstruction: { type: String, default: "" },

    // EXTRA COVERED AREA
    extraCoveredArea: { type: String, default: "" },
    extraCoveredAreaSqft: { type: String, default: "" },
    extraCoveredAreaRateOfConstruction: { type: String, default: "" },
    extraCoveredAreaValueOfConstruction: { type: String, default: "" }
    }, { _id: false });

const ubiApfSchema = new mongoose.Schema({
    // BASIC INFO
    clientId: { type: String, required: true, index: true },
    uniqueId: { type: String, required: true, sparse: true },
    username: { type: String, required: true },
    dateTime: { type: String, required: true },
    day: { type: String, required: true },

    // BANK & CITY
    bankName: { type: String, required: true },
    city: { type: String, required: true },
    customBankName: { type: String, default: "" },
    customCity: { type: String, default: "" },

    // CLIENT DETAILS
    clientName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    address: { type: String, required: true },

    // PAYMENT
    payment: { type: String, required: true },
    collectedBy: { type: String, default: "" },

    // DSA & ENGINEER
    dsa: { type: String, required: true },
    customDsa: { type: String, default: "" },
    engineerName: { type: String, required: true, default: "" },
    customEngineerName: { type: String, default: "" },

    // NOTES
    notes: { type: String, default: "" },
    selectedForm: { type: String, default: null },

    // PROPERTY BASIC DETAILS
    elevation: { type: String, default: "" },

    directions: { type: ubiApfDirectionSchema, default: () => ({}) },
    coordinates: { type: ubiApfCoordinateSchema, default: () => ({}) },

    propertyImages: [mongoose.Schema.Types.Mixed],
    locationImages: [mongoose.Schema.Types.Mixed],
    photos: { type: ubiApfPhotoSchema, default: () => ({}) },
    status: {
        type: String,
        enum: ["pending", "on-progress", "approved", "rejected", "rework"],
        default: "pending"
    },
    managerFeedback: { type: String, default: "" },
    submittedByManager: { type: Boolean, default: false },
    lastUpdatedBy: { type: String, default: "" },
    lastUpdatedByRole: { type: String, default: "" },
    reworkComments: { type: String, default: "" },
    reworkRequestedBy: { type: String, default: "" },
    reworkRequestedAt: { type: Date, default: null },
    reworkRequestedByRole: { type: String, default: "" },
    pdfDetails: { type: ubiApfPdfDetailsSchema, default: () => ({}) },
    lastUpdatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
ubiApfSchema.index({ clientId: 1, uniqueId: 1 }, { unique: true, sparse: true });

ubiApfSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const ubiApfModel = mongoose.model("ubiApf", ubiApfSchema, "ubi_Apf");
export default ubiApfModel;
