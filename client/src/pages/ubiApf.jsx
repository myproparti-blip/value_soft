import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import exifr from 'exifr';
import { getFormRouteForBank, isBofMaharashtraBank } from "../config/bankFormMapping";
import {
    FaArrowLeft,
    FaMapMarkerAlt,
    FaUpload,
    FaPrint,
    FaDownload,
    FaUser,
    FaFileAlt,
    FaCog,
    FaCompass,
    FaBuilding,
    FaImage,
    FaLocationArrow,
    FaCheckCircle,
    FaTimesCircle,
    FaSave,
    FaThumbsUp,
    FaThumbsDown,
    FaRedo
} from "react-icons/fa";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Textarea, Label, Badge, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, RadioGroup, RadioGroupItem, ChipSelect } from "../components/ui";
import { getUbiApfFormById, updateUbiApfForm, managerSubmitUbiApfForm, requestReworkUbiApfForm } from "../services/ubiApfService";
import { showLoader, hideLoader } from "../redux/slices/loaderSlice";
import { useNotification } from "../context/NotificationContext";
import { uploadPropertyImages, uploadLocationImages } from "../services/imageService";
import { invalidateCache } from "../services/axios";
import { getCustomOptions } from "../services/customOptionsService";
import ClientInfoPanel from "../components/ClientInfoPanel";
import DocumentsPanel from "../components/DocumentsPanel";
import { generateRecordPDFOffline } from "../services/ubiShopPdf";

const UbiApfEditForm = ({ user, onLogin }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [valuation, setValuation] = useState(null);
    const isLoggedIn = !!user;
    const [bankName, setBankName] = useState("");
    const [city, setCity] = useState("");
    const [dsa, setDsa] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [modalFeedback, setModalFeedback] = useState("");
    const [activeTab, setActiveTab] = useState("client");
    const [activeValuationSubTab, setActiveValuationSubTab] = useState("general");
    const { showSuccess, showError } = useNotification();
    const [formData, setFormData] = useState({
        // BASIC INFO
        uniqueId: '',
        username: '',
        dateTime: '',
        day: '',

        // BANK & CITY
        bankName: '',
        city: '',

        // CLIENT DETAILS
        clientName: '',
        mobileNumber: '',
        address: '',

        // PAYMENT
        payment: '',
        collectedBy: '',

        // DSA
        dsa: '',
        customDsa: '',

        // ENGINEER
        engineerName: '',
        customEngineerName: '',

        // NOTES
        notes: '',

        // PROPERTY BASIC DETAILS
        elevation: '',
        // DIRECTIONS
        directions: {
            north1: '',
            east1: '',
            south1: '',
            west1: '',
            north2: '',
            east2: '',
            south2: '',
            west2: ''
        },

        // COORDINATES
        coordinates: {
            latitude: '',
            longitude: ''
        },

        // IMAGES
        propertyImages: [],
        locationImages: [],
        photos: {
            elevationImages: [],
            siteImages: []
        },

        // STATUS
        status: 'pending',
        managerFeedback: '',
        submittedByManager: false,
        lastUpdatedBy: '',
        lastUpdatedByRole: '',

        // PDF DETAILS (AUTO-EXTRACTED)
        pdfDetails: {
            formId: '',
            branch: '',
            valuationPurpose: '',
            inspectionDate: '',
            valuationMadeDate: '',

            mortgageDeed: '',
            mortgageDeedBetween: '',
            previousValuationReport: '',
            previousValuationInFavorOf: '',
            approvedPlanNo: '',

            // GENERAL SECTION - DOCUMENTS
            purposeOfValuation: '',
            dateOfInspection: '',
            dateOfValuationMade: '',
            agreementForSale: '',
            commencementCertificate: '',
            occupancyCertificate: '',
            ownerNameAddress: '',
            briefDescriptionProperty: '',

            ownerName: '',

            // PROPERTY DESCRIPTION / LOCATION OF PROPERTY
            plotSurveyNo: '',
            doorNo: '',
            tpVillage: '',
            wardTaluka: '',
            mandalDistrict: '',
            layoutPlanIssueDate: '',
            approvedMapAuthority: '',
            authenticityVerified: '',
            valuerCommentOnAuthenticity: '',
            otherApprovedPlanDetails: '',
            valuesApprovedPlan: '',

            postalAddress: '',
            cityTown: '',
            residentialArea: false,
            commercialArea: false,
            industrialArea: false,
            locationOfProperty: '',

            // INDUSTRIAL AREA DETAILS - Section 9
            areaClassification: '',
            urbanClassification: '',
            governmentType: '',
            govtEnactmentsCovered: '',

            // BOUNDARIES OF PROPERTY - Section 12
            boundariesPlotNorthDeed: '',
            boundariesPlotNorthActual: '',
            boundariesPlotSouthDeed: '',
            boundariesPlotSouthActual: '',
            boundariesPlotEastDeed: '',
            boundariesPlotEastActual: '',
            boundariesPlotWestDeed: '',
            boundariesPlotWestActual: '',
            boundariesShopNorthDeed: '',
            boundariesShopNorthActual: '',
            boundariesShopSouthDeed: '',
            boundariesShopSouthActual: '',
            boundariesShopEastDeed: '',
            boundariesShopEastActual: '',
            boundariesShopWestDeed: '',
            boundariesShopWestActual: '',

            // DIMENSIONS OF THE UNIT - Section 13
            dimensionsDeed: '',
            dimensionsActual: '',

            // EXTENT OF THE UNIT - Section 14
            extentOfUnit: '',
            latitudeLongitude: '',
            floorSpaceIndex: '',

            // EXTENT OF SITE CONSIDERED FOR VALUATION - Section 15
            extentOfSiteValuation: '',

            // SECTION 16 - OCCUPANCY
            rentReceivedPerMonth: '',

            // APARTMENT BUILDING DETAILS - Section II
            apartmentNature: '',
            apartmentLocation: '',
            apartmentCTSNo: '',
            apartmentSectorNo: '',
            apartmentBlockNo: '',
            apartmentWardNo: '',
            apartmentVillageMunicipalityCounty: '',
            apartmentDoorNoStreetRoad: '',
            apartmentPinCode: '',

            // APARTMENT BUILDING SUBSECTIONS
            descriptionOfLocalityResidentialCommercialMixed: '',
            yearOfConstruction: '',
            numberOfFloors: '',
            typeOfStructure: '',
            numberOfDwellingUnitsInBuilding: '',
            qualityOfConstruction: '',
            appearanceOfBuilding: '',
            maintenanceOfBuilding: '',

            // VALUE OF FLAT - SECTION C
            fairMarketValue: '',
            realizableValue: '',
            distressValue: '',
            saleDeedValue: '',
            agreementCircleRate: '',
            agreementValue: '',
            valueCircleRate: '',
            insurableValue: '',
            totalJantriValue: '',

            // FLAT SPECIFICATIONS EXTENDED
            areaUsage: '',
            carpetAreaFlat: '',

            // MONTHLY RENT
            ownerOccupancyStatus: '',
            monthlyRent: '',

            // MARKETABILITY SECTION
            marketability: '',
            favoringFactors: '',
            negativeFactors: '',

            // RATE SECTION
            comparableRate: '',
            adoptedBasicCompositeRate: '',
            buildingServicesRate: '',
            landOthersRate: '',
            guidelineRate: '',

            // COMPOSITE RATE AFTER DEPRECIATION
            depreciatedBuildingRate: '',
            replacementCostServices: '',
            buildingAge: '',
            buildingLife: '',
            depreciationPercentage: '',
            deprecatedRatio: '',

            // MARKET RATE ANALYSIS
            marketabilityDescription: '',
            smallFlatDescription: '',
            newConstructionArea: '',
            rateAdjustments: '',

            // BREAK-UP FOR THE ABOVE RATE
            goodwillRate: '',

            // COMPOSITE RATE AFTER DEPRECIATION (LEGACY)
            depreciationBuildingDate: '',
            depreciationStorage: '',

            // TOTAL COMPOSITE RATE
            totalCompositeRate: '',
            rateForLandOther: '',

            // VALUATION DETAILS - Items (Qty, Rate, Value rows)
            presentValueQty: '',
            presentValueRate: '',
            presentValue: '',
            wardrobesQty: '',
            wardrobesRate: '',
            wardrobes: '',
            showcasesQty: '',
            showcasesRate: '',
            showcases: '',
            kitchenArrangementsQty: '',
            kitchenArrangementsRate: '',
            kitchenArrangements: '',
            superfineFinishQty: '',
            superfineFinishRate: '',
            superfineFinish: '',
            interiorDecorationsQty: '',
            interiorDecorationsRate: '',
            interiorDecorations: '',
            electricityDepositsQty: '',
            electricityDepositsRate: '',
            electricityDeposits: '',
            collapsibleGatesQty: '',
            collapsibleGatesRate: '',
            collapsibleGates: '',
            potentialValueQty: '',
            potentialValueRate: '',
            potentialValue: '',
            otherItemsQty: '',
            otherItemsRate: '',
            otherItems: '',
            totalValuationItems: '',

            // SECTION 3: FLAT/UNIT SPECIFICATIONS
            unitFloor: '',
            unitDoorNo: '',
            unitRoof: '',
            unitFlooring: '',
            unitDoors: '',
            unitBathAndWC: '',
            unitElectricalWiring: '',
            unitSpecification: '',
            unitFittings: '',
            unitFinishing: '',

            // SECTION 4: UNIT TAX/ASSESSMENT
            assessmentNo: '',
            taxPaidName: '',
            taxAmount: '',

            // SECTION 5: ELECTRICITY SERVICE
            electricityServiceNo: '',
            meterCardName: '',

            // SECTION 6: UNIT MAINTENANCE
            unitMaintenance: '',

            // SECTION 7: AGREEMENT FOR SALE
            agreementSaleExecutedName: '',

            // SECTION 8 & 9: UNIT AREA DETAILS
            undividedAreaLand: '',
            plinthArea: '',
            carpetArea: '',

            // SECTION 10-14: UNIT CLASSIFICATION
            classificationPosh: '',
            classificationUsage: '',
            classificationOwnership: '',

            // SIGNATURE & REPORT DETAILS
            place: '',
            signatureDate: '',
            signerName: '',
            reportDate: '',
            fairMarketValueWords: '',

            // FACILITIES AVAILABLE
            liftAvailable: '',
            protectedWaterSupply: '',
            undergroundSewerage: '',
            carParkingOpenCovered: '',
            isCompoundWallExisting: '',
            isPavementLaidAroundBuilding: '',
            othersFacility: '',

            // DECLARATIONS
            declarationB: '',
            declarationD: '',
            declarationE: '',
            declarationI: '',
            declarationJ: '',

            // VALUATION INFORMATION DETAILS
            assetBackgroundInfo: '',
            valuationPurposeAuthority: '',
            valuersIdentity: '',
            valuersConflictDisclosure: '',
            dateOfAppointment: '',
            inspectionsUndertaken: '',
            informationSources: '',
            valuationProcedures: '',
            reportRestrictions: '',
            majorFactors: '',
            additionalFactors: '',
            caveatsLimitations: '',

            // PROPERTY DETAILS (EXTENDED)
            briefDescriptionOfProperty: '',
            locationOfProperty: '',
            plotNo: '',
            surveyNo: '',
            taluka: '',
            mandal: '',
            district: '',
            residentialArea: '',
            commercialArea: '',
            industrialArea: '',
            classificationOfArea: '',
            height: '',
            urbanRural: '',
            mileSemUrban: '',
            municipalCorporationAsPer: '',

            // BOUNDARY & DIMENSIONS (EXTENDED)
            boundariesOfTheProperty: '',
            northBoundary: '',
            southBoundary: '',
            eastBoundary: '',
            westBoundary: '',

            // LAYOUT & MEASUREMENTS
            plotLayoutNo: '',
            sNo41: '',
            sNo42: '',
            sNo9: '',
            asPerDeedNo: '',
            asPerDeedArea: '',

            // CONSTRUCTION DETAILS
            constructionAsPer: '',
            panchayatMunicipalitySearchReport: '',
            watercoveredUnderSaleDeeds: '',
            governmentEnctmentsOrUtilitiesScheduledArea: '',

            // APPROVAL & VALIDITY
            dateIssueAndValidityOfApprovedPlan: '',
            whetherGenerousOnAuthority: '',
            anyOtherCommentsOrAuthorityApprovedPlan: '',

            // BUILDING CONSTRUCTION INFO
            buildingConsistenceAs: '',
            greyWordCompleted: '',
            mrDwyingUnderwaiting: '',
            approvedPlaneAssembly: '',

            // BUILDING SPECIFICATIONS
            buildingPlan: '',
            groundFloorArea: '',
            approvedPlan: '',

            // VALUATION REPORT DETAILS
            purposeForValuation: '',
            dateOnWhichValuationIsMade: '',
            listOfDocumentsProducedForPerusal: '',
            protocolDocuments: '',

            // SANCTIONED PLAN
            sanctionedPlanStatus: '',
            certificateNumber: '',

            // BUILDING COMPLETION
            buildingCompletionCertificate: '',
            completionCertificateNo: '',
            ownerAddressJointOwners: '',
            jointOwnersDeDetailsOfJointOwnership: '',

            // APARTMENT BUILDING SECTION (Extended)
            classificationOfLocality: '',
            developmentOfSurroundingAreas: '',
            possibilityOfFutureHousingMixing: '',
            feasibilityOf1To2Kms: '',
            typeOfStructureMaterial: '',
            shareOfLand: '',
            typeOfUseToWhichItCanBePut: '',
            anyUsageRestriction: '',
            isPlotInTownPlanning: '',
            cornerPlotOrInteriorFacilities: '',
            yearOfRoadAvailability: '',
            waterRoadAvailableBelowOrAbove: '',
            isALandArea: '',
            waterSewerageSystem: '',

            // VALUATION DETAILS (EXTENDED)
            assessedOrAdoptedRateForValuation: '',
            estimatedRuleOfLand: '',
            technicalDetailsOfBuilding: '',
            typeOfBuildingVenture: '',
            typeOfConstructionLandCeiling: '',
            typeOfPropertyVenture: '',
            yearOfProperty: '',
            residualUseOfBuildingEstimated: '',
            carpetAreaMeasurementDetails: '',

            // PLOT & AREA DETAILS (EXTENDED)
            plotAreaNorth: '',
            plotAreaSouth: '',
            plotAreaEast: '',
            plotAreaWest: '',
            extentOfArea: '',
            technicalDetailsOfStructure: '',
            typeOfConstructionFrame: '',

            // FLOOR AREA DETAILS
            groundFloorAreaBuiltUp: '',
            firstFloor: '',
            secondFloor: '',
            thirdFloor: '',
            fourthFloor: '',
            fifthFloor: '',
            sixthFloor: '',
            seventhFloor: '',
            eighthFloor: '',
            ninthFloor: '',
            tenthFloor: '',
            basementFloor: '',
            totalCarpetArea: '',

            // CONSTRUCTION SPECIFICATIONS
            finishingWorkInProgress: '',
            buildingPlanStructured: '',
            dateIssueAndValidityOfLayout: '',
            approvalAuthority: '',
            weatherGenuinessOrAuthenticity: '',
            anyOtherComments: '',
            specificationConstructionFloorSlab: '',
            foundationDescription: '',
            basementDescription: '',
            superstructureDescription: '',
            entranceDoor: '',
            otherDoor: '',
            windows: '',
            flooringShirtingDetails: '',
            specialFinish: '',
            roofingWeatherproofCourse: '',
            drainage: '',
            damp: '',
            rccFrameOrRccSlab: '',
            proposedETPPlantPerPCBNorms: '',

            // PLOT CONSTRUCTION & LAYOUT DETAILS
            compoundwall: '',
            length: '',
            typeOfConstruction: '',
            electricalInstallationPlot: '',
            typeOfWiringPlot: '',
            numberOfFittingPoints: '',
            farPlugsPlot: '',
            sparePlugPlot: '',
            anyOtherItemPlot: '',
            printingInstallation: '',
            numberOfWaterClassAndTapsPlot: '',
            noWashBasinsPlot: '',
            noUrinalsPlot: '',
            noOfBathtubsPlot: '',
            waterMeterTapsPlot: '',
            anyOtherFixturePlot: '',

            // ORNAMENTAL & AMENITIES DETAILS
            ornamentalFloor: '',
            ornamentalFloorAmount: '',
            stuccoVeranda: '',
            stuccoVerandaAmount: '',
            sheetGrills: '',
            sheetGrillsAmount: '',
            overheadWaterTank: '',
            overheadWaterTankAmount: '',
            extraShedPossibleGates: '',
            extraShedPossibleGatesAmount: '',
            ornamentalTotal: '',

            // PART C - AMENITIES
            partCAmenities1Description: '',
            partCAmenities1AmountInRupees: '',
            partCAmenities2Description: '',
            partCAmenities2AmountInRupees: '',
            partCAmenities3Description: '',
            partCAmenities3AmountInRupees: '',
            partCAmenities4Description: '',
            partCAmenities4AmountInRupees: '',
            partCAmenitiesTotal: '',

            // PART D - WORKBEDS
            partDWorkbeds1Description: '',
            partDWorkbeds1AmountInRupees: '',
            partDWorkbeds2Description: '',
            partDWorkbeds2AmountInRupees: '',
            partDWorkbeds3Description: '',
            partDWorkbeds3AmountInRupees: '',
            partDWorkbeds4Description: '',
            partDWorkbeds4AmountInRupees: '',
            partDWorbedsTotal: '',

            // AMENITIES DETAILED ITEMS
            amenitiesGlazedTubAndBed: '',
            amenitiesGlazedTubAndBedAmount: '',
            amenitiesExteriorStudAndBed: '',
            amenitiesExteriorStudAndBedAmount: '',
            amenitiesMaritalCeiling: '',
            amenitiesMaritalCeilingAmount: '',

            // PART E - MISCELLANEOUS
            partEMiscellaneous1Description: '',
            partEMiscellaneous1AmountInRupees: '',
            partEMiscellaneous2Description: '',
            partEMiscellaneous2AmountInRupees: '',
            partEMiscellaneous3Description: '',
            partEMiscellaneous3AmountInRupees: '',
            partEMiscellaneous4Description: '',
            partEMiscellaneous4AmountInRupees: '',
            partEMiscellaneousTotal: '',

            // MISCELLANEOUS ITEMS
            miscellaneousSeparateToiletRoom: '',
            miscellaneousSeparateToiletRoomAmount: '',
            miscellaneousSeparateLumberRoom: '',
            miscellaneousSeparateLumberRoomAmount: '',
            miscellaneousSeparateWaterTankSump: '',
            miscellaneousSeparateWaterTankSumpAmount: '',
            miscellaneousTreesGardening: '',
            miscellaneousTreesGardeningAmount: '',

            // BUILDING VALUATION DETAILS
            estimatedRepairCostOfConstruction: '',
            rateOfConstruction: '',
            buildUpAreaInSqft: '',
            groundFloorSqft: '',
            groundFloorRateOfConstruction: '',
            groundFloorValueOfConstruction: '',
            secondFloorSqft: '',
            secondFloorRateOfConstruction: '',
            secondFloorValueOfConstruction: '',
            thirdFloorSqft: '',
            thirdFloorRateOfConstruction: '',
            thirdFloorValueOfConstruction: '',
            fourthFloorSqft: '',
            fourthFloorRateOfConstruction: '',
            fourthFloorValueOfConstruction: '',
            fifthFloorSqft: '',
            fifthFloorRateOfConstruction: '',
            fifthFloorValueOfConstruction: '',
            sixthFloorSqft: '',
            sixthFloorRateOfConstruction: '',
            sixthFloorValueOfConstruction: '',
            basementFloorSqft: '',
            basementFloorRateOfConstruction: '',
            basementFloorValueOfConstruction: '',
            carpetAreaInSqft: '',
            carpetAreaRateOfConstruction: '',
            carpetAreaValueOfConstruction: '',

            // EXTRA ITEMS TABLE
            extraItemsLand: '',
            extraItemsLandAmount: '',
            extraItemsBuilding: '',
            extraItemsBuildingAmount: '',
            extraItemsExtra: '',
            extraItemsExtraAmount: '',
            extraItemsAmenities: '',
            extraItemsAmenitiesAmount: '',
            extraItemsMiscellaneous: '',
            extraItemsMiscellaneousAmount: '',
            extraItemsServices: '',
            extraItemsServicesAmount: '',
            extraItemsTotalValue: '',

            // ELECTRICAL & PLUMBING INSTALLATIONS
            electricalInstallation: '',
            typeOfWiring: '',
            classOfFittings: '',
            numberOfLightPoints: '',
            farPlugs: '',
            sparePlug: '',
            anyOtherElectricalItem: '',
            plumbingInstallation: '',
            numberOfWaterClassAndTaps: '',
            noWashBasins: '',
            noUrinals: '',
            noOfBathtubs: '',
            waterMeterTapsEtc: '',
            anyOtherPlumbingFixture: '',

            // FIVE FEET AROUND PLOT
            feetAroundPlot: '',
            rcMasonryWallsUpToPlinth: '',
            aboveRcMasonryWallsExternally: '',

            // BUILDING VALUATION EXTRA DETAILS
            estimatedRCCRepairCostOfConstruction: '',
            floorAreaSqft: '',
            rateOfConstructionPerSqft: '',
            valueOfConstruction: '',
            rateOfConstructionValues: '',

            // SERVICES (Part F)
            services1Description: '',
            services1Amount: '',
            waterSupplyArrangements: '',
            waterSupplyArrangementsAmount: '',
            undergroundStorageCapacity: '',
            undergroundStorageCapacityAmount: '',
            drainageArrangements: '',
            drainageArrangementsAmount: '',
            compoundWall: '',
            compoundWallAmount: '',
            siteDevelopment: '',
            siteDevelopmentAmount: '',
            swimmingPool: '',
            swimmingPoolAmount: '',
            servicesTotal: '',

            // PROPERTY VALUATION NARRATIVE
            abstractOfEntireProperty: '',
            partALandAmount: '',
            partBBuildingAmount: '',
            partCExtraItemsAmount: '',
            partDExtraItemsAmount: '',
            partEExtraItemsAmount: '',
            partFServicesAmount: '',
            totalAbstractValue: '',

            // FAIR MARKET VALUE OPINION
            fairMarketValueOpinion: '',
            fairMarketValueAmount: '',
            propertyAnalysisStatement: '',
            openMarketValueStatement: '',

            // BUILDING VALUATION COMPOUND WALL
            buildingValuationCompoundWall: '',
            buildingValuationHeight: '',
            buildingValuationLength: '',
            buildingValuationTypeOfConstruction: '',
            buildingValuationElectricalInstallation: '',
            buildingValuationTypeOfWiring: '',
            buildingValuationClassOfFittings: '',
            buildingValuationNumberOfLightPoints: '',
            buildingValuationFarPlugs: '',
            buildingValuationSparePlug: '',
            buildingValuationAnyOtherElectricalItem: '',
            buildingValuationPlumbingInstallation: '',
            buildingValuationNumberOfWaterClassAndTaps: '',
            buildingValuationNoWashBasins: '',
            buildingValuationNoUrinals: '',
            buildingValuationNoOfBathtubs: '',
            buildingValuationWaterMeterTapsEtc: '',
            buildingValuationAnyOtherPlumbingFixture: '',

            // PART C - EXTRA ITEMS WITH FLOOR WISE DETAILS
            partCExtraItemsFloorWise: '',
            partCExtraItemsGroundFloor: '',
            partCExtraItemsServiceFloor: '',
            partCExtraItemsFirstFloor: '',
            partCExtraItemsSecondFloor: '',
            partCExtraItemsThirdFloor: '',
            partCExtraItemsFourthFloor: '',
            partCExtraItemsFifthFloor: '',
            partCExtraItemsSixthFloor: '',
            partCExtraItemsBasementFloor: '',
            partCExtraItemsCarotyArea: '',

            // PART C - EXTRA ITEMS WITH SQFT AND RATES
            partCExtraItemsSqftGroundFloor: '',
            partCExtraItemsSqftServiceFloor: '',
            partCExtraItemsSqftFirstFloor: '',
            partCExtraItemsSqftSecondFloor: '',
            partCExtraItemsSqftThirdFloor: '',
            partCExtraItemsSqftFourthFloor: '',
            partCExtraItemsSqftFifthFloor: '',
            partCExtraItemsSqftSixthFloor: '',
            partCExtraItemsSqftBasementFloor: '',
            partCExtraItemsSqftCarpetArea: '',

            partCExtraItemsRateGroundFloor: '',
            partCExtraItemsRateServiceFloor: '',
            partCExtraItemsRateFirstFloor: '',
            partCExtraItemsRateSecondFloor: '',
            partCExtraItemsRateThirdFloor: '',
            partCExtraItemsRateFourthFloor: '',
            partCExtraItemsRateFifthFloor: '',
            partCExtraItemsRateSixthFloor: '',
            partCExtraItemsRateBasementFloor: '',
            partCExtraItemsRateCarpetArea: '',

            partCExtraItemsValueGroundFloor: '',
            partCExtraItemsValueServiceFloor: '',
            partCExtraItemsValueFirstFloor: '',
            partCExtraItemsValueSecondFloor: '',
            partCExtraItemsValueThirdFloor: '',
            partCExtraItemsValueFourthFloor: '',
            partCExtraItemsValueFifthFloor: '',
            partCExtraItemsValueSixthFloor: '',
            partCExtraItemsValueBasementFloor: '',
            partCExtraItemsValueCarpetArea: '',

            // AGE OF BUILDING DEPRECIATION
            ageOfBuildingYears: '',
            lifeOfBuilding: '',
            depreciationPercentage: '',

            // LAND VALUATION SECTION
            floorAreaSqftLand: '',
            ratePerSqftLand: '',
            interior0PercentLand: '',
            entranceCanopyArea: '',

            // PART A - LAND
            partALand1Description: '',
            partALand1Amount: '',
            partALand2Description: '',
            partALand2Amount: '',
            partALand3Description: '',
            partALand3Amount: '',
            partALand4Description: '',
            partALand4Amount: '',
            partALandTotal: '',

            // PART B - BUILDING
            partBBuilding1Description: '',
            partBBuilding1Amount: '',
            partBBuilding2Description: '',
            partBBuilding2Amount: '',
            partBBuilding3Description: '',
            partBBuilding3Amount: '',
            partBBuilding4Description: '',
            partBBuilding4Amount: '',
            partBBuildingTotal: '',

            // PART F - SERVICES DETAILS
            partFServices1Description: '',
            partFServices1Amount: '',
            partFServices2Description: '',
            partFServices2Amount: '',
            partFServices3Description: '',
            partFServices3Amount: '',
            partFServices4Description: '',
            partFServices4Amount: '',
            partFServices5Description: '',
            partFServices5Amount: '',

            // ORNAMENTAL EXTENDED
            ornamental1Description: '',
            ornamental1Amount: '',
            ornamental2Description: '',
            ornamental2Amount: '',
            ornamental3Description: '',
            ornamental3Amount: '',
            ornamental4Description: '',
            ornamental4Amount: '',
            ornamental5Description: '',
            ornamental5Amount: '',

            // ADDITIONAL BUILDING DETAILS
            ageOfBuildingDescription: '',
            lifeOfBuildingYears: '',
            depreciationValue: '',
            depreciatedRate: '',

            // LAND DETAILS EXTENDED
            floorAreaDescription: '',
            floorAreaSqftValue: '',
            floorAreaToSqftFirstFloor: '',
            floorAreaBuiltUpCompletion: '',
            floorAreaCarpetArea: '',
            floorAreaEntranceCanopyArea: '',

            // RATES & VALUES EXTENDED
            rateOfConstructionPercentage: '',
            depreciationPercentageValue: '',
            yetOfProperty: '',

            // INTERIOR & FINISH DETAILS
            interiorExcellent: '',
            interiorGood: '',
            interiorPoor: '',

            // COMPOUND WALL & FIXTURES
            compoundWallMasonryHeight: '',
            compoundWallFenceDetails: '',

            // WATER & SANITATION
            waterTankAboveGround: '',
            waterTankUnderground: '',
            waterTankRCCStorageCapacity: '',

            // SITE DEVELOPMENT
            siteDevelopmentDrainageDetails: '',
            siteDevelopmentCompoundWallHeight: '',
            siteDevelopmentTrees: '',

            // FIRST FLOOR AREA SECTIONS
            firstFloorNorthSection: '',
            firstFloorSouthSection: '',
            firstFloorEastSection: '',
            firstFloorWestSection: '',

            // ADDITIONAL DEPRECIATION & AGE FIELDS
            ageOfBuildingMonths: '',
            totalLifeOfBuilding: '',
            remainingLifePercentage: '',

            // ADDITIONAL MISSING FIELDS
            portico: '',
            porticoAmount: '',
            description: '',
            land: '',
            building: '',
            extraItems: '',
            amenities: '',
            miscellaneous: '',
            services: '',
            partACarpetArea: '',
            partBCarpetArea: '',
            partCCarpetArea: '',
            partDCarpetArea: '',
            partECarpetArea: '',
            partFCarpetArea: '',

            // ADDITIONAL BUILDING DETAILS
            serviceFloor: '',
            serviceFloorSqft: '',
            serviceFloorRateOfConstruction: '',
            serviceFloorValueOfConstruction: '',

            // PARKING & GARAGE
            parkingFloorSqft: '',
            parkingFloorRateOfConstruction: '',
            parkingFloorValueOfConstruction: '',

            // STILT FLOOR
            stiltFloor: '',
            stiltFloorSqft: '',
            stiltFloorRateOfConstruction: '',
            stiltFloorValueOfConstruction: '',

            // EXTRA COVERED AREA
            extraCoveredArea: '',
            extraCoveredAreaSqft: '',
            extraCoveredAreaRateOfConstruction: '',
            extraCoveredAreaValueOfConstruction: ''
        },

        // CUSTOM FIELDS FOR DROPDOWN HANDLING
        customBankName: '',
        customCity: '',
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const [locationImagePreviews, setLocationImagePreviews] = useState([]);
    const [banks, setBanks] = useState([]);
    const [cities, setCities] = useState([]);
    const [dsaNames, setDsaNames] = useState([]);
    const [engineerNames, setEngineerNames] = useState([]);
    const [customOptions, setCustomOptions] = useState({
        dsa: [],
        engineerName: [],
        bankName: [],
        city: []
    });

    const fileInputRef1 = useRef(null);
    const fileInputRef2 = useRef(null);
    const fileInputRef3 = useRef(null);
    const fileInputRef4 = useRef(null);
    const locationFileInputRef = useRef(null);

    const username = user?.username || "";
    const role = user?.role || "";
    const clientId = user?.clientId || "";

    // Helper function to navigate to the correct form based on selectedForm or bank name
    const navigateToEditForm = (record) => {
        console.log("🔵 navigateToEditForm called");
        console.log("📊 Record data:", record);
        console.log("🏦 bankName value:", record?.bankName);
        console.log("📋 selectedForm value:", record?.selectedForm);
        console.log("🆔 uniqueId value:", record?.uniqueId);

        let formRoute;

        // First priority: use selectedForm if explicitly set
        if (record?.selectedForm === 'bomFlat') {
            // BOM Flat form route
            formRoute = "/valuationeditformbomaharastra";
            console.log("✅ Routing based on selectedForm='bomFlat'");
        } else if (record?.selectedForm === 'ubiShop') {
            // UBI Shop form route
            formRoute = "/valuationeditform";
            console.log("✅ Routing based on selectedForm='ubiShop'");
        } else if (record?.selectedForm === 'ubiApf') {
            // UBI APF form route
            formRoute = "/valuationeditformubiapf";
            console.log("✅ Routing based on selectedForm='ubiApf'");
        } else {
            // If no selectedForm, use bank-based routing
            // Check if bank is BOM first, then use getFormRouteForBank
            if (isBofMaharashtraBank(record?.bankName)) {
                formRoute = "/valuationeditformbomaharastra";
                console.log("✅ Routing based on isBofMaharashtraBank check");
            } else {
                formRoute = getFormRouteForBank(record?.bankName);
                console.log("✅ Routing based on getFormRouteForBank");
            }
        }

        console.log("✅ Final route:", formRoute, "for record:", record?.selectedForm || record?.bankName);
        navigate(`${formRoute}/${record.uniqueId}`);
    };

    const handleDownloadPDF = async () => {
        try {
            dispatch(showLoader());
            // ALWAYS fetch fresh data from DB - do not use local state which may be stale
            let dataToDownload;

            try {
                dataToDownload = await getUbiApfFormById(id, username, role, clientId);
                console.log('✅ Fresh UBI APF data fetched for PDF:', {
                    bankName: dataToDownload?.bankName,
                    city: dataToDownload?.city
                });
            } catch (fetchError) {
                console.error('❌ Failed to fetch fresh UBI APF data:', fetchError);
                // Only fallback to valuation/formData if fetch fails
                dataToDownload = valuation;
                if (!dataToDownload) {
                    console.warn('UBI APF form data is null, using formData');
                    dataToDownload = formData;
                }
            }

            await generateRecordPDFOffline(dataToDownload);
            showSuccess('PDF downloaded successfully');
        } catch (error) {
            console.error('Error downloading PDF:', error);
            showError('Failed to download PDF');
        } finally {
            dispatch(hideLoader());
        }
    };

    useEffect(() => {
        if (id) loadValuation();
    }, [id]);

    useEffect(() => {
        loadValuation();
        fetchDropdownData();
    }, [id]);

    // Helper function to convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Fetch dropdown data from API
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [banksData, citiesData, dsaData, engineerData] = await Promise.all([
                    getCustomOptions('banks'),
                    getCustomOptions('cities'),
                    getCustomOptions('dsa'),
                    getCustomOptions('engineers')
                ]);
                setBanks(Array.isArray(banksData) ? banksData : []);
                setCities(Array.isArray(citiesData) ? citiesData : []);
                setDsaNames(Array.isArray(dsaData) ? dsaData : []);
                setEngineerNames(Array.isArray(engineerData) ? engineerData : []);
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
                // Continue with empty arrays if fetch fails
            }
        };
        fetchDropdownData();
    }, []);

    const fetchDropdownData = async () => {
        try {
            const [banksData, citiesData, dsaData, engineerData] = await Promise.all([
                getCustomOptions('banks'),
                getCustomOptions('cities'),
                getCustomOptions('dsa'),
                getCustomOptions('engineers')
            ]);
            setBanks(Array.isArray(banksData) ? banksData : []);
            setCities(Array.isArray(citiesData) ? citiesData : []);
            setDsaNames(Array.isArray(dsaData) ? dsaData : []);
            setEngineerNames(Array.isArray(engineerData) ? engineerData : []);
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

    const loadValuation = async () => {
        const savedData = localStorage.getItem(`valuation_draft_${username}`);
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData.uniqueId === id) {
                setValuation(parsedData);
                mapDataToForm(parsedData);
                return;
            }
        }

        try {
            // Pass user info for authentication
            const dbData = await getUbiApfFormById(id, username, role, clientId);
            setValuation(dbData);
            mapDataToForm(dbData);

            // Restore property image previews from database
            if (dbData.propertyImages && Array.isArray(dbData.propertyImages)) {
                const propertyPreviews = dbData.propertyImages
                    .filter(img => img && typeof img === 'object')
                    .map((img, idx) => {
                        let previewUrl = '';
                        if (img.url) {
                            previewUrl = img.url;
                        } else if (img.path) {
                            const fileName = img.path.split('\\').pop() || img.path.split('/').pop();
                            previewUrl = `/api/uploads/${fileName}`;
                        } else if (img.fileName) {
                            previewUrl = `/api/uploads/${img.fileName}`;
                        }
                        return {
                            preview: previewUrl,
                            file: null,
                            inputNumber: img.inputNumber || 1
                        };
                    })
                    .filter(preview => preview.preview);
                if (propertyPreviews.length > 0) {
                    setImagePreviews(propertyPreviews);
                }
            }

            // Restore location image previews from database
            if (dbData.locationImages && Array.isArray(dbData.locationImages)) {
                const locationPreviews = dbData.locationImages
                    .filter(img => img && typeof img === 'object')
                    .map((img, idx) => {
                        let previewUrl = '';
                        if (img.url) {
                            previewUrl = img.url;
                        } else if (img.path) {
                            const fileName = img.path.split('\\').pop() || img.path.split('/').pop();
                            previewUrl = `/api/uploads/${fileName}`;
                        } else if (img.fileName) {
                            previewUrl = `/api/uploads/${img.fileName}`;
                        }
                        return {
                            preview: previewUrl,
                            file: null
                        };
                    })
                    .filter(preview => preview.preview);
                if (locationPreviews.length > 0) {
                    setLocationImagePreviews(locationPreviews);
                }
            }

            setBankName(dbData.bankName || "");
            setCity(dbData.city || "");
            setDsa(dbData.dsa || "");
        } catch (error) {
            console.error("Error loading valuation:", error);
            // Continue without data
        }
    };

    const mapDataToForm = (data) => {
        setFormData(prev => ({
            ...prev,
            ...data,
            pdfDetails: { ...prev.pdfDetails, ...data.pdfDetails }
        }));
    };

    const canEdit = isLoggedIn && (
        (role === "admin") ||
        (role === "manager" && (valuation?.status === "pending" || valuation?.status === "rejected" || valuation?.status === "on-progress" || valuation?.status === "rework")) ||
        ((role === "user") && (valuation?.status === "rejected" || valuation?.status === "pending" || valuation?.status === "rework"))
    );

    const canEditField = (fieldName) => {
        // Allow editing if status allows it
        return canEdit;
    };

    const canApprove = isLoggedIn && (role === "manager" || role === "admin") &&
        (valuation?.status === "pending" || valuation?.status === "on-progress" || valuation?.status === "rejected" || valuation?.status === "rework");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleIntegerInputChange = (e, callback) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (callback) callback(value);
    };

    const handleLettersOnlyInputChange = (e, callback) => {
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        if (callback) callback(value);
    };

    const handleSave = async () => {
        try {
            dispatch(showLoader());
            await updateUbiApfForm(id, formData, user.username, user.role, user.clientId);
            invalidateCache();
            dispatch(hideLoader());
            showSuccess('BOF Maharashtra form saved successfully');
        } catch (error) {
            console.error("Error saving BOF Maharashtra form:", error);
            dispatch(hideLoader());
            showError('Failed to save BOF Maharashtra form');
        }
    };

    const handleValuationChange = (field, value) => {
        setFormData(prev => {
            const newPdfDetails = {
                ...prev.pdfDetails,
                [field]: value
            };

            // Auto-calculate Estimated Value = Qty × Rate for all 10 items
            const items = [
                { qtyField: 'presentValueQty', rateField: 'presentValueRate', valueField: 'presentValue' },
                { qtyField: 'wardrobesQty', rateField: 'wardrobesRate', valueField: 'wardrobes' },
                { qtyField: 'showcasesQty', rateField: 'showcasesRate', valueField: 'showcases' },
                { qtyField: 'kitchenArrangementsQty', rateField: 'kitchenArrangementsRate', valueField: 'kitchenArrangements' },
                { qtyField: 'superfineFinishQty', rateField: 'superfineFinishRate', valueField: 'superfineFinish' },
                { qtyField: 'interiorDecorationsQty', rateField: 'interiorDecorationsRate', valueField: 'interiorDecorations' },
                { qtyField: 'electricityDepositsQty', rateField: 'electricityDepositsRate', valueField: 'electricityDeposits' },
                { qtyField: 'collapsibleGatesQty', rateField: 'collapsibleGatesRate', valueField: 'collapsibleGates' },
                { qtyField: 'potentialValueQty', rateField: 'potentialValueRate', valueField: 'potentialValue' },
                { qtyField: 'otherItemsQty', rateField: 'otherItemsRate', valueField: 'otherItems' }
            ];

            // Check if the changed field is a qty or rate field and auto-calculate
            items.forEach(item => {
                if (field === item.qtyField || field === item.rateField) {
                    const qty = parseFloat(newPdfDetails[item.qtyField]) || 0;
                    const rate = parseFloat(newPdfDetails[item.rateField]) || 0;
                    const estimatedValue = qty * rate;
                    newPdfDetails[item.valueField] = estimatedValue > 0 ? estimatedValue.toString() : '';
                }
            });

            // Auto-populate Value of Flat section based on ROUND FIGURE value
            const isQtyOrRateField = items.some(item => field === item.qtyField || field === item.rateField);
            if (isQtyOrRateField) {
                const totalValuation = items.reduce((sum, item) => {
                    const value = parseFloat(newPdfDetails[item.valueField]) || 0;
                    return sum + value;
                }, 0);

                // Round to nearest 1000
                const roundFigureTotal = Math.round(totalValuation / 1000) * 1000;

                // Auto-populate the 4 calculated fields based on ROUND FIGURE (if not manually edited)
                if (!newPdfDetails.fairMarketValue || newPdfDetails.fairMarketValue === '') {
                    newPdfDetails.fairMarketValue = roundFigureTotal > 0 ? roundFigureTotal.toString() : '';
                }
                if (!newPdfDetails.realizableValue || newPdfDetails.realizableValue === '') {
                    newPdfDetails.realizableValue = roundFigureTotal > 0 ? (roundFigureTotal * 0.9).toString() : '';
                }
                if (!newPdfDetails.distressValue || newPdfDetails.distressValue === '') {
                    newPdfDetails.distressValue = roundFigureTotal > 0 ? (roundFigureTotal * 0.8).toString() : '';
                }
                if (!newPdfDetails.insurableValue || newPdfDetails.insurableValue === '') {
                    newPdfDetails.insurableValue = roundFigureTotal > 0 ? (roundFigureTotal * 0.35).toString() : '';
                }
            }

            return {
                ...prev,
                pdfDetails: newPdfDetails
            };
        });
    };

    const handleLocationImageUpload = async (e) => {
        const files = e.target.files;
        if (!files) return;

        for (let file of files) {
            try {
                const base64 = await fileToBase64(file);
                setLocationImagePreviews(prev => [
                    ...prev,
                    { preview: base64, name: file.name, file: file }
                ]);
            } catch (error) {
                console.error('Error converting file to base64:', error);
                showError('Failed to upload image');
            }
        }
    };

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files) return;

        for (let file of files) {
            try {
                const base64 = await fileToBase64(file);
                setImagePreviews(prev => [
                    ...prev,
                    { preview: base64, name: file.name, file: file }
                ]);
            } catch (error) {
                console.error('Error converting file to base64:', error);
                showError('Failed to upload image');
            }
        }
    };

    const removeLocationImage = (index) => {
        setLocationImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleCoordinateChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            coordinates: {
                ...prev.coordinates,
                [field]: value
            }
        }));
    };

    const handleDirectionChange = (direction, value) => {
        setFormData(prev => ({
            ...prev,
            directions: {
                ...prev.directions,
                [direction]: value
            }
        }));
    };

    const validateForm = () => {
        const errors = [];

        // === CLIENT INFORMATION ===
        if (!formData.clientName || !formData.clientName.trim()) {
            errors.push("Client Name is required");
        }

        if (!formData.mobileNumber || !formData.mobileNumber.trim()) {
            errors.push("Mobile Number is required");
        } else {
            // Mobile number validation - exactly 10 digits
            const mobileDigits = formData.mobileNumber.replace(/\D/g, '');
            if (mobileDigits.length !== 10) {
                errors.push("Mobile Number must be 10 digits");
            }
        }

        if (!formData.address || !formData.address.trim()) {
            errors.push("Address is required");
        }

        // === BANK & CITY ===
        const finalBankName = bankName === "other" ? formData.customBankName : bankName;
        if (!finalBankName || !finalBankName.trim()) {
            errors.push("Bank Name is required");
        }

        const finalCity = city === "other" ? formData.customCity : city;
        if (!finalCity || !finalCity.trim()) {
            errors.push("City is required");
        }

        // === MARKET APPLICATIONS / DSA (Sales Agent) ===
        const finalDsa = formData.dsa === "other" ? formData.customDsa : formData.dsa;
        if (!finalDsa || !finalDsa.trim()) {
            errors.push("Market Applications / DSA (Sales Agent) is required");
        }

        // === ENGINEER NAME ===
        const finalEngineerName = formData.engineerName === "other" ? formData.customEngineerName : formData.engineerName;
        if (!finalEngineerName || !finalEngineerName.trim()) {
            errors.push("Engineer Name is required");
        }

        // === PAYMENT INFORMATION ===
        if (formData.payment === "yes" && (!formData.collectedBy || !formData.collectedBy.trim())) {
            errors.push("Collected By name is required when payment is collected");
        }

        // === GPS COORDINATES VALIDATION ===
        if (formData.coordinates.latitude || formData.coordinates.longitude) {
            if (formData.coordinates.latitude) {
                const lat = parseFloat(formData.coordinates.latitude);
                if (isNaN(lat) || lat < -90 || lat > 90) {
                    errors.push("Latitude must be a valid number between -90 and 90");
                }
            }

            if (formData.coordinates.longitude) {
                const lng = parseFloat(formData.coordinates.longitude);
                if (isNaN(lng) || lng < -180 || lng > 180) {
                    errors.push("Longitude must be a valid number between -180 and 180");
                }
            }
        }

        // === PROPERTY IMAGES VALIDATION ===
        if (imagePreviews.length === 0) {
            errors.push("Property image is required");
        }

        // === LOCATION IMAGES VALIDATION ===
        if (locationImagePreviews.length === 0) {
            errors.push("Location image is required");
        }

        return errors;
    };

    const validatePdfDetails = () => {
        const errors = [];
        return errors;
    };

    const handleManagerAction = (action) => {
        setModalAction(action);
        setModalFeedback("");
        setModalOpen(true);
    };

    const handleModalOk = async () => {
        const statusValue = modalAction === "approve" ? "approved" : "rejected";
        const actionLabel = modalAction === "approve" ? "Approve" : "Reject";

        try {
            setLoading(true);
            dispatch(showLoader(`${actionLabel}ing form...`));

            const responseData = await managerSubmitUbiApfForm(id, statusValue, modalFeedback, user.username, user.role);

            invalidateCache("/bof-maharashtra");

            // Update the form state with response data from backend
            setValuation(responseData);

            showSuccess(`BOF Maharashtra form ${statusValue} successfully!`);
            dispatch(hideLoader());
            setModalOpen(false);

            setTimeout(() => {
                navigate("/dashboard", { replace: true });
            }, 300);
        } catch (err) {
            showError(err.message || `Failed to ${actionLabel.toLowerCase()} form`);
            dispatch(hideLoader());
            setLoading(false);
        }
    };

    const onFinish = async (e) => {
        e.preventDefault();

        const isUserUpdate = role === "user" && (valuation.status === "pending" || valuation.status === "rejected" || valuation.status === "rework");
        const isManagerUpdate = role === "manager" && (valuation.status === "pending" || valuation.status === "rejected" || valuation.status === "on-progress" || valuation.status === "rework");
        const isAdminUpdate = role === "admin";

        if (!isUserUpdate && !isManagerUpdate && !isAdminUpdate) {
            showError("You don't have permission to update this form");
            return;
        }

        // Validate form
        const validationErrors = validateForm();
        const pdfDetailsErrors = validatePdfDetails();
        const allErrors = [...validationErrors, ...pdfDetailsErrors];
        if (allErrors.length > 0) {
            // Show single consolidated error instead of multiple notifications
            showError(` ${allErrors.join(", ")}`);
            return;
        }

        try {
            setLoading(true);
            dispatch(showLoader("Saving..."));

            const payload = {
                clientId: clientId,
                uniqueId: formData.uniqueId || id,
                username: formData.username || username,
                dateTime: formData.dateTime,
                day: formData.day,
                bankName: bankName === "other" ? (formData.customBankName || "").trim() : bankName,
                city: city === "other" ? (formData.customCity || "").trim() : city,
                clientName: formData.clientName,
                mobileNumber: formData.mobileNumber,
                address: formData.address,
                payment: formData.payment,
                collectedBy: formData.collectedBy,
                dsa: dsa === "other" ? (formData.customDsa || "").trim() : dsa,
                engineerName: formData.engineerName === "other" ? (formData.customEngineerName || "").trim() : formData.engineerName,
                notes: formData.notes,
                elevation: formData.elevation,
                directions: formData.directions,
                coordinates: formData.coordinates,
                status: "on-progress",
                pdfDetails: formData.pdfDetails
            };

            // Handle image uploads - parallel
            const [uploadedPropertyImages, uploadedLocationImages] = await Promise.all([
                (async () => {
                    const newPropertyImages = imagePreviews.filter(p => p && p.file);
                    if (newPropertyImages.length > 0) {
                        return await uploadPropertyImages(newPropertyImages, valuation.uniqueId);
                    }
                    return [];
                })(),
                (async () => {
                    const newLocationImages = locationImagePreviews.filter(p => p && p.file);
                    if (newLocationImages.length > 0) {
                        return await uploadLocationImages(newLocationImages, valuation.uniqueId);
                    }
                    return [];
                })()
            ]);

            // Combine previously saved images with newly uploaded URLs
            const previousPropertyImages = imagePreviews
                .filter(p => p && !p.file && p.preview)
                .map((preview, idx) => ({
                    url: preview.preview,
                    index: idx
                }));

            // For location images: if new image uploaded, use only the new one; otherwise use previous
            const previousLocationImages = (uploadedLocationImages.length === 0)
                ? locationImagePreviews
                    .filter(p => p && !p.file && p.preview)
                    .map((preview, idx) => ({
                        url: preview.preview,
                        index: idx
                    }))
                : [];

            payload.propertyImages = [...previousPropertyImages, ...uploadedPropertyImages];
            payload.locationImages = uploadedLocationImages.length > 0 ? uploadedLocationImages : previousLocationImages;

            // Clear draft before API call
            localStorage.removeItem(`valuation_draft_${username}`);

            // Call API to update BOF Maharashtra form
            const apiResponse = await updateUbiApfForm(id, payload, username, role, clientId);
            invalidateCache("/bof-maharashtra");

            // Get the actual status from API response (server updates to on-progress on save)
            const newStatus = apiResponse?.status || "on-progress";

            // Update local state with API response
            const updatedValuation = {
                ...valuation,
                ...(apiResponse || {}),
                ...payload,
                status: newStatus, // Use server-confirmed status
                lastUpdatedBy: apiResponse?.lastUpdatedBy || username,
                lastUpdatedByRole: apiResponse?.lastUpdatedByRole || role,
                lastUpdatedAt: apiResponse?.lastUpdatedAt || new Date().toISOString()
            };

            setValuation(updatedValuation);
            // Set bank and city states based on whether they're in default lists
            const bankState = banks.includes(payload.bankName) ? payload.bankName : "other";
            const cityState = cities.includes(payload.city) ? payload.city : "other";
            setBankName(bankState);
            setCity(cityState);
            // Update formData with trimmed custom values
            setFormData(prev => ({
                ...prev,
                ...payload,
                customBankName: bankState === "other" ? payload.bankName : "",
                customCity: cityState === "other" ? payload.city : "",
                customDsa: formData.dsa === "other" ? (payload.dsa || "").trim() : "",
                customEngineerName: formData.engineerName === "other" ? (payload.engineerName || "").trim() : ""
            }));

            showSuccess("Form saved successfully!");
            dispatch(hideLoader());
            setTimeout(() => {
                navigate("/dashboard", { replace: true });
            }, 300);
        } catch (err) {
            const errorMessage = err.message || "Failed to update form";
            showError(errorMessage);
            dispatch(hideLoader());
            setLoading(false);
        }
    };

    const renderGeneralTab = () => (
        <div className="space-y-6">
            <div className="mb-6 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-4">Purpose of Valuation</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Purpose of Valuation</Label>
                        <Input
                            placeholder="e.g., Mortgage/Loan Purpose"
                            value={formData.pdfDetails?.purposeOfValuation || ""}
                            onChange={(e) => handleValuationChange('purposeOfValuation', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Date of Inspection</Label>
                        <Input
                            type="date"
                            value={formData.pdfDetails?.dateOfInspection || ""}
                            onChange={(e) => handleValuationChange('dateOfInspection', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Date of Valuation Made</Label>
                        <Input
                            type="date"
                            value={formData.pdfDetails?.dateOfValuationMade || ""}
                            onChange={(e) => handleValuationChange('dateOfValuationMade', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Place</Label>
                        <Input
                            type="text"
                            placeholder="e.g., City/Location"
                            value={formData.pdfDetails?.place || ""}
                            onChange={(e) => handleValuationChange('place', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <Label className="text-sm font-bold text-gray-900">List of Documents Produced</Label>
                    <Textarea
                        placeholder="Enter list of documents"
                        value={formData.pdfDetails?.listOfDocumentsProduced || ""}
                        onChange={(e) => handleValuationChange('listOfDocumentsProduced', e.target.value)}
                        disabled={!canEdit}
                        className="text-sm rounded-lg border border-neutral-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        rows="3"
                    />
                </div>
            </div>

            {/* OWNER & BRIEF DESCRIPTION */}
            <div className="mb-6 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                <h4 className="font-bold text-gray-900 mb-4">Owner Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Owner Name(s) and their Address</Label>
                        <Textarea
                            placeholder="Enter owner name and address"
                            value={formData.pdfDetails?.ownerNameAddress || ""}
                            onChange={(e) => handleValuationChange('ownerNameAddress', e.target.value)}
                            disabled={!canEdit}
                            className="text-sm rounded-lg border border-neutral-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            rows="2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Brief Description of the Property</Label>
                        <Textarea
                            placeholder="Enter brief description"
                            value={formData.pdfDetails?.briefDescriptionProperty || ""}
                            onChange={(e) => handleValuationChange('briefDescriptionProperty', e.target.value)}
                            disabled={!canEdit}
                            className="text-sm rounded-lg border border-neutral-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            rows="2"
                        />
                    </div>
                </div>
            </div>

            {/* PROPERTY LOCATION & DESCRIPTION */}
            <div className="mb-6 p-6 bg-cyan-50 rounded-2xl border border-cyan-100">
                <h4 className="font-bold text-gray-900 mb-4">Location of the property</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">a) Plot No./ Survey No.</Label>
                        <Input
                            placeholder="e.g., S. No. 26"
                            value={formData.pdfDetails?.plotSurveyNo || ""}
                            onChange={(e) => handleValuationChange('plotSurveyNo', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">b) Door No.</Label>
                        <Input
                            placeholder="e.g., Hali No. B-4502"
                            value={formData.pdfDetails?.doorNo || ""}
                            onChange={(e) => handleValuationChange('doorNo', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">c) T.S. No./Village</Label>
                        <Input
                            placeholder="e.g., Yasai"
                            value={formData.pdfDetails?.tpVillage || ""}
                            onChange={(e) => handleValuationChange('tpVillage', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">d) Ward/Taluka</Label>
                        <Input
                            placeholder="e.g., Taluka"
                            value={formData.pdfDetails?.wardTaluka || ""}
                            onChange={(e) => handleValuationChange('wardTaluka', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">e) District</Label>
                        <Input
                            placeholder="e.g., District"
                            value={formData.pdfDetails?.mandalDistrict || ""}
                            onChange={(e) => handleValuationChange('mandalDistrict', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">f) Date of issue and validity of layout plan</Label>
                        <Input
                            type="date"
                            value={formData.pdfDetails?.layoutPlanIssueDate || ""}
                            onChange={(e) => handleValuationChange('layoutPlanIssueDate', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">g) Approved map/plan issuing authority </Label>
                        <Input
                            placeholder="e.g., CIDCO"
                            value={formData.pdfDetails?.approvedMapAuthority || ""}
                            onChange={(e) => handleValuationChange('approvedMapAuthority', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">h) Whether authenticity of approved map/plan is verified</Label>
                        <select
                            value={formData.pdfDetails?.authenticityVerified || ""}
                            onChange={(e) => handleValuationChange('authenticityVerified', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select Status</option>
                            <option value="Verified">Yes</option>
                            <option value="Not Verified">Not</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">i) Any other conveniences provided by our approved plan</Label>
                        <Textarea
                            placeholder="e.g., Parking, Amenities, etc."
                            value={formData.pdfDetails?.otherApprovedPlanDetails || ""}
                            onChange={(e) => handleValuationChange('otherApprovedPlanDetails', e.target.value)}
                            disabled={!canEdit}
                            className="text-sm rounded-lg border border-neutral-300"
                            rows="2"
                        />
                    </div>


                </div>
            </div>

            {/* POSTAL ADDRESS & CLASSIFICATION */}
            <div className="mb-6 p-6 bg-violet-50 rounded-2xl border border-violet-100">
                <h4 className="font-bold text-gray-900 mb-4">Property Classification & Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Postal Address of the property</Label>
                        <Textarea
                            placeholder="Enter full address"
                            value={formData.pdfDetails?.postalAddress || ""}
                            onChange={(e) => handleValuationChange('postalAddress', e.target.value)}
                            disabled={!canEdit}
                            className="text-sm rounded-lg border border-neutral-300"
                            rows="3"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">City/Town</Label>
                        <Input
                            placeholder="e.g., Mumbai"
                            value={formData.pdfDetails?.cityTown || ""}
                            onChange={(e) => handleValuationChange('cityTown', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                </div>
                <div className="mt-4 space-y-3">
                    <Label className="text-sm font-bold text-gray-900">Area Type</Label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.pdfDetails?.residentialArea || false}
                                onChange={(e) => handleValuationChange('residentialArea', e.target.checked)}
                                disabled={!canEdit}
                                className="w-4 h-4 rounded"
                            />
                            <span className="text-sm">Residential Area</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.pdfDetails?.commercialArea || false}
                                onChange={(e) => handleValuationChange('commercialArea', e.target.checked)}
                                disabled={!canEdit}
                                className="w-4 h-4 rounded"
                            />
                            <span className="text-sm">Commercial Area</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.pdfDetails?.industrialArea || false}
                                onChange={(e) => handleValuationChange('industrialArea', e.target.checked)}
                                disabled={!canEdit}
                                className="w-4 h-4 rounded"
                            />
                            <span className="text-sm">Industrial Area</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* BOUNDARIES OF PROPERTY */}
            <div className="mb-6 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <h4 className="font-bold text-gray-900 mb-4">Boundaries of Property</h4>
                <div className="space-y-6">
                    {/* Plot Boundaries Table */}
                    <div>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-indigo-100">
                                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-900 w-1/4">a</th>
                                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-900 w-1/4">Boundaries of the property - Plot</th>
                                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-900 w-1/4">As per Deed</th>
                                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-900 w-1/4">As per Actual</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="1" className="border border-gray-300 p-3"></td>
                                    <td className="border border-gray-300 p-3 font-semibold text-gray-800">North</td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesPlotNorthDeed || ""}
                                            onChange={(e) => handleValuationChange('boundariesPlotNorthDeed', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesPlotNorthActual || ""}
                                            onChange={(e) => handleValuationChange('boundariesPlotNorthActual', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className="border border-gray-300 p-3"></td>
                                    <td className="border border-gray-300 p-3 font-semibold text-gray-800">South</td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesPlotSouthDeed || ""}
                                            onChange={(e) => handleValuationChange('boundariesPlotSouthDeed', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesPlotSouthActual || ""}
                                            onChange={(e) => handleValuationChange('boundariesPlotSouthActual', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className="border border-gray-300 p-3"></td>
                                    <td className="border border-gray-300 p-3 font-semibold text-gray-800">East</td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesPlotEastDeed || ""}
                                            onChange={(e) => handleValuationChange('boundariesPlotEastDeed', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesPlotEastActual || ""}
                                            onChange={(e) => handleValuationChange('boundariesPlotEastActual', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className="border border-gray-300 p-3"></td>
                                    <td className="border border-gray-300 p-3 font-semibold text-gray-800">West</td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesPlotWestDeed || ""}
                                            onChange={(e) => handleValuationChange('boundariesPlotWestDeed', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesPlotWestActual || ""}
                                            onChange={(e) => handleValuationChange('boundariesPlotWestActual', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Flat/Shop Boundaries Table */}
                    <div>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-indigo-100">
                                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-900 w-1/4">b</th>
                                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-900 w-1/4">Boundaries of the property - Flat</th>
                                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-900 w-1/4">As per Deed</th>
                                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-900 w-1/4">As per Actual</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="1" className="border border-gray-300 p-3"></td>
                                    <td className="border border-gray-300 p-3 font-semibold text-gray-800">North</td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesShopNorthDeed || ""}
                                            onChange={(e) => handleValuationChange('boundariesShopNorthDeed', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesShopNorthActual || ""}
                                            onChange={(e) => handleValuationChange('boundariesShopNorthActual', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className="border border-gray-300 p-3"></td>
                                    <td className="border border-gray-300 p-3 font-semibold text-gray-800">South</td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesShopSouthDeed || ""}
                                            onChange={(e) => handleValuationChange('boundariesShopSouthDeed', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesShopSouthActual || ""}
                                            onChange={(e) => handleValuationChange('boundariesShopSouthActual', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className="border border-gray-300 p-3"></td>
                                    <td className="border border-gray-300 p-3 font-semibold text-gray-800">East</td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesShopEastDeed || ""}
                                            onChange={(e) => handleValuationChange('boundariesShopEastDeed', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesShopEastActual || ""}
                                            onChange={(e) => handleValuationChange('boundariesShopEastActual', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className="border border-gray-300 p-3"></td>
                                    <td className="border border-gray-300 p-3 font-semibold text-gray-800">West</td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesShopWestDeed || ""}
                                            onChange={(e) => handleValuationChange('boundariesShopWestDeed', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesShopWestActual || ""}
                                            onChange={(e) => handleValuationChange('boundariesShopWestActual', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* DIMENSIONS OF THE PROPERTY */}
            <div className="mb-6 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-4">Dimensions of the Unit</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Dimensions (as per Document)</Label>
                        <Input
                            placeholder="e.g., 28.88 Sq. ft. / 2.88 Sq. ft."
                            value={formData.pdfDetails?.dimensionsDeed || ""}
                            onChange={(e) => handleValuationChange('dimensionsDeed', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Dimensions (as per Actuals)</Label>
                        <Input
                            placeholder="e.g., 28.88 Sq. ft. / 2.88 Sq. ft."
                            value={formData.pdfDetails?.dimensionsActual || ""}
                            onChange={(e) => handleValuationChange('dimensionsActual', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                </div>
            </div>

            {/* EXTENT OF THE UNIT */}
            <div className="mb-6 p-6 bg-green-50 rounded-2xl border border-green-100">
                <h4 className="font-bold text-gray-900 mb-4">Extent of the site</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Extent of Site</Label>
                        <Input
                            placeholder="e.g., ₹ 40,34,950 per Sq. ft."
                            value={formData.pdfDetails?.extentOfUnit || ""}
                            onChange={(e) => handleValuationChange('extentOfUnit', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Latitude/Longitude</Label>
                        <Input
                            placeholder="e.g., 19°07'53.2 N & 73°00"
                            value={formData.pdfDetails?.latitudeLongitude || ""}
                            onChange={(e) => handleValuationChange('latitudeLongitude', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>

                </div>
            </div>

            {/* EXTENT OF SITE & RENT */}
            <div className="mb-6 p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
                <h4 className="font-bold text-gray-900 mb-4">Extent & Occupancy Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Extent of Site Considered for Valuation</Label>
                        <Input
                            placeholder="e.g., Area in Sq. ft."
                            value={formData.pdfDetails?.extentOfSiteValuation || ""}
                            onChange={(e) => handleValuationChange('extentOfSiteValuation', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Whether occupied by the owner/tenant? If occupied by tenant, since how long? Rent
                            received per month </Label>
                        <Input
                            placeholder="Owner/ Tenant & Rent Amount"
                            value={formData.pdfDetails?.rentReceivedPerMonth || ""}
                            onChange={(e) => handleValuationChange('rentReceivedPerMonth', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                </div>
            </div>

            {/* AREA CLASSIFICATION */}
            <div className="mb-6 p-6 bg-teal-50 rounded-2xl border border-teal-100">
                <h4 className="font-bold text-gray-900 mb-4">Area Classification</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">High/Middle/Poor</Label>
                        <select
                            value={formData.pdfDetails?.areaClassification || ""}
                            onChange={(e) => handleValuationChange('areaClassification', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select</option>
                            <option value="High">High</option>
                            <option value="Middle">Middle</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Metro / Urban / Semi-Urban / Rural</Label>
                        <select
                            value={formData.pdfDetails?.urbanClassification || ""}
                            onChange={(e) => handleValuationChange('urbanClassification', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select</option>
                            <option value="Metro">Metro</option>
                            <option value="Urban">Urban</option>
                            <option value="Semi-Urban">Semi-Urban</option>
                            <option value="Rural">Rural</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Government Type / Comming Under</Label>
                        <select
                            value={formData.pdfDetails?.governmentType || ""}
                            onChange={(e) => handleValuationChange('governmentType', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select Type</option>
                            <option value="Municipal">Municipality</option>
                            <option value="Corporation">Corporation</option>
                            <option value="Government">Government</option>
                            <option value="Village Panchayat">Village Panchayat</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Whether covered under any Govt. Enactments</Label>
                        <select
                            value={formData.pdfDetails?.govtEnactmentsCovered || ""}
                            onChange={(e) => handleValuationChange('govtEnactmentsCovered', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderValuationTab = () => {
        // Helper function to format numbers as Indian currency
        const formatIndianCurrency = (value) => {
            if (!value) return '₹0.00';
            const num = parseFloat(value) || 0;
            return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };

        // Helper function to round to nearest 1000
        const roundToNearestThousand = (value) => {
            const num = parseFloat(value) || 0;
            return Math.round(num / 1000) * 1000;
        };

        // Calculate total valuation from all items
        const calculateTotalValuation = () => {
            const values = [
                parseFloat(formData.pdfDetails?.presentValue) || 0,
                parseFloat(formData.pdfDetails?.wardrobes) || 0,
                parseFloat(formData.pdfDetails?.showcases) || 0,
                parseFloat(formData.pdfDetails?.kitchenArrangements) || 0,
                parseFloat(formData.pdfDetails?.superfineFinish) || 0,
                parseFloat(formData.pdfDetails?.interiorDecorations) || 0,
                parseFloat(formData.pdfDetails?.electricityDeposits) || 0,
                parseFloat(formData.pdfDetails?.collapsibleGates) || 0,
                parseFloat(formData.pdfDetails?.potentialValue) || 0,
                parseFloat(formData.pdfDetails?.otherItems) || 0
            ];
            return values.reduce((sum, val) => sum + val, 0);
        };

        const totalValuation = calculateTotalValuation();
        const roundFigureTotal = roundToNearestThousand(totalValuation);
        const realisableValue = totalValuation * 0.9;
        const distressValue = totalValuation * 0.8;
        const insurableValue = totalValuation * 0.35;

        return (
            <div className="space-y-6">
                {/* VALUATION ITEMS TABLE */}
                <div className="mb-6 p-6 bg-rose-50 rounded-2xl border border-rose-100">
                    <h4 className="font-bold text-gray-900 mb-4 text-base">Valuation Details Table</h4>
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full border-collapse text-xs">
                            <thead>
                                <tr className="bg-rose-100 border border-rose-200">
                                    <th className="px-2 py-3 text-left font-bold text-gray-900 border border-rose-200 min-w-[50px]">Sr. No.</th>
                                    <th className="px-2 py-3 text-left font-bold text-gray-900 border border-rose-200 min-w-[200px]">Description</th>
                                    <th className="px-2 py-3 text-left font-bold text-gray-900 border border-rose-200 min-w-[120px]">Qty/Sq. ft.</th>
                                    <th className="px-2 py-3 text-left font-bold text-gray-900 border border-rose-200 min-w-[140px]">Rate</th>
                                    <th className="px-2 py-3 text-left font-bold text-gray-900 border border-rose-200 min-w-[150px]">Estimated Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Present Value of Flat */}
                                <tr className="border border-rose-200">
                                    <td className="px-2 py-2 border border-rose-200 text-xs font-bold text-center">1</td>
                                    <td className="px-2 py-2 border border-rose-200 text-xs">Present Value of Hard Built up area</td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.presentValueQty || ""} onChange={(e) => handleValuationChange('presentValueQty', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.presentValueRate || ""} onChange={(e) => handleValuationChange('presentValueRate', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.presentValue || ""} onChange={(e) => handleValuationChange('presentValue', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                </tr>
                                {/* Wardrobes */}
                                <tr className="border border-rose-200">
                                    <td className="px-2 py-2 border border-rose-200 text-xs font-bold text-center">2</td>
                                    <td className="px-2 py-2 border border-rose-200 text-xs">Wardrobes</td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.wardrobesQty || ""} onChange={(e) => handleValuationChange('wardrobesQty', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.wardrobesRate || ""} onChange={(e) => handleValuationChange('wardrobesRate', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.wardrobes || ""} onChange={(e) => handleValuationChange('wardrobes', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                </tr>
                                {/* Showcases */}
                                <tr className="border border-rose-200">
                                    <td className="px-2 py-2 border border-rose-200 text-xs font-bold text-center">3</td>
                                    <td className="px-2 py-2 border border-rose-200 text-xs">Show cases, Almirah</td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.showcasesQty || ""} onChange={(e) => handleValuationChange('showcasesQty', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.showcasesRate || ""} onChange={(e) => handleValuationChange('showcasesRate', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.showcases || ""} onChange={(e) => handleValuationChange('showcases', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                </tr>
                                {/* Kitchen Arrangements */}
                                <tr className="border border-rose-200">
                                    <td className="px-2 py-2 border border-rose-200 text-xs font-bold text-center">4</td>
                                    <td className="px-2 py-2 border border-rose-200 text-xs">Kitchen arrangements</td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.kitchenArrangementsQty || ""} onChange={(e) => handleValuationChange('kitchenArrangementsQty', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.kitchenArrangementsRate || ""} onChange={(e) => handleValuationChange('kitchenArrangementsRate', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.kitchenArrangements || ""} onChange={(e) => handleValuationChange('kitchenArrangements', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                </tr>
                                {/* Superficial Finish */}
                                <tr className="border border-rose-200">
                                    <td className="px-2 py-2 border border-rose-200 text-xs font-bold text-center">5</td>
                                    <td className="px-2 py-2 border border-rose-200 text-xs">Superfine Finish</td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.superfineFinishQty || ""} onChange={(e) => handleValuationChange('superfineFinishQty', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.superfineFinishRate || ""} onChange={(e) => handleValuationChange('superfineFinishRate', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.superfineFinish || ""} onChange={(e) => handleValuationChange('superfineFinish', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                </tr>
                                {/* Interiors, Decorations */}
                                <tr className="border border-rose-200">
                                    <td className="px-2 py-2 border border-rose-200 text-xs font-bold text-center">6</td>
                                    <td className="px-2 py-2 border border-rose-200 text-xs">Interior Decorations</td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.interiorDecorationsQty || ""} onChange={(e) => handleValuationChange('interiorDecorationsQty', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.interiorDecorationsRate || ""} onChange={(e) => handleValuationChange('interiorDecorationsRate', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.interiorDecorations || ""} onChange={(e) => handleValuationChange('interiorDecorations', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                </tr>
                                {/* Electrical Deposits */}
                                <tr className="border border-rose-200">
                                    <td className="px-2 py-2 border border-rose-200 text-xs font-bold text-center">7</td>
                                    <td className="px-2 py-2 border border-rose-200 text-xs">Electricity Deposits</td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.electricityDepositsQty || ""} onChange={(e) => handleValuationChange('electricityDepositsQty', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.electricityDepositsRate || ""} onChange={(e) => handleValuationChange('electricityDepositsRate', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.electricityDeposits || ""} onChange={(e) => handleValuationChange('electricityDeposits', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                </tr>
                                {/* Collapsible Gates */}
                                <tr className="border border-rose-200">
                                    <td className="px-2 py-2 border border-rose-200 text-xs font-bold text-center">8</td>
                                    <td className="px-2 py-2 border border-rose-200 text-xs">Collapsible Gates</td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.collapsibleGatesQty || ""} onChange={(e) => handleValuationChange('collapsibleGatesQty', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.collapsibleGatesRate || ""} onChange={(e) => handleValuationChange('collapsibleGatesRate', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.collapsibleGates || ""} onChange={(e) => handleValuationChange('collapsibleGates', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                </tr>
                                {/* Potential Value */}
                                <tr className="border border-rose-200">
                                    <td className="px-2 py-2 border border-rose-200 text-xs font-bold text-center">9</td>
                                    <td className="px-2 py-2 border border-rose-200 text-xs">Potential Value</td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.potentialValueQty || ""} onChange={(e) => handleValuationChange('potentialValueQty', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.potentialValueRate || ""} onChange={(e) => handleValuationChange('potentialValueRate', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.potentialValue || ""} onChange={(e) => handleValuationChange('potentialValue', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                </tr>
                                {/* Others */}
                                <tr className="border border-rose-200">
                                    <td className="px-2 py-2 border border-rose-200 text-xs font-bold text-center">10</td>
                                    <td className="px-2 py-2 border border-rose-200 text-xs">Others</td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.otherItemsQty || ""} onChange={(e) => handleValuationChange('otherItemsQty', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.otherItemsRate || ""} onChange={(e) => handleValuationChange('otherItemsRate', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                    <td className="px-2 py-2 border border-rose-200"><Input type="number" value={formData.pdfDetails?.otherItems || ""} onChange={(e) => handleValuationChange('otherItems', e.target.value)} disabled={!canEdit} className="h-8 text-xs border border-neutral-300 bg-white rounded px-2 w-full" /></td>
                                </tr>
                                {/* Total Row */}
                                <tr className="bg-rose-200 border border-rose-300 font-bold">
                                    <td colSpan="4" className="px-2 py-3 border border-rose-300 text-xs text-right">TOTAL</td>
                                    <td className="px-2 py-3 border border-rose-300 text-xs text-gray-900">{formatIndianCurrency(totalValuation)}</td>
                                </tr>
                                {/* Round Figure Row */}
                                <tr className="bg-orange-200 border border-orange-300 font-bold">
                                    <td colSpan="4" className="px-2 py-3 border border-orange-300 text-xs text-right">ROUND FIGURE</td>
                                    <td className="px-2 py-3 border border-orange-300 text-xs text-gray-900">{formatIndianCurrency(roundFigureTotal)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* VALUE OF FLAT - AUTO-CALCULATED RESULTS SECTION */}
                <div className="mb-6 p-6 bg-teal-50 rounded-2xl border border-teal-100">
                    <h4 className="font-bold text-gray-900 mb-4 text-base">Value of Flat - Auto-Calculated Results</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-900">Total Valuation (Market Value)</Label>
                            <Input
                                type="number"
                                placeholder="Auto-calculated or enter value"
                                value={formData.pdfDetails?.fairMarketValue || ""}
                                onChange={(e) => handleValuationChange('fairMarketValue', e.target.value)}
                                disabled={!canEdit}
                                className="h-9 text-xs rounded-lg border border-teal-300 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 px-3 w-full"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-900">Realisable Value (90%)</Label>
                            <Input
                                type="number"
                                placeholder="Auto-calculated or enter value"
                                value={formData.pdfDetails?.realizableValue || ""}
                                onChange={(e) => handleValuationChange('realizableValue', e.target.value)}
                                disabled={!canEdit}
                                className="h-9 text-xs rounded-lg border border-teal-300 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 px-3 w-full"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-900">Distress Value (80%)</Label>
                            <Input
                                type="number"
                                placeholder="Auto-calculated or enter value"
                                value={formData.pdfDetails?.distressValue || ""}
                                onChange={(e) => handleValuationChange('distressValue', e.target.value)}
                                disabled={!canEdit}
                                className="h-9 text-xs rounded-lg border border-teal-300 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 px-3 w-full"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-900">Insurable Value (35%)</Label>
                            <Input
                                type="number"
                                placeholder="Auto-calculated or enter value"
                                value={formData.pdfDetails?.insurableValue || ""}
                                onChange={(e) => handleValuationChange('insurableValue', e.target.value)}
                                disabled={!canEdit}
                                className="h-9 text-xs rounded-lg border border-teal-300 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 px-3 w-full"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-900">Agreement Value</Label>
                            <Input
                                type="number"
                                placeholder="Enter Agreement Value"
                                value={formData.pdfDetails?.agreementValue || ""}
                                onChange={(e) => handleValuationChange('agreementValue', e.target.value)}
                                disabled={!canEdit}
                                className="h-9 text-xs rounded-lg border border-teal-300 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 px-3 w-full"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-900">Value as per Circle Rate</Label>
                            <Input
                                type="number"
                                placeholder="Enter Value as per Circle Rate"
                                value={formData.pdfDetails?.valueCircleRate || ""}
                                onChange={(e) => handleValuationChange('valueCircleRate', e.target.value)}
                                disabled={!canEdit}
                                className="h-9 text-xs rounded-lg border border-teal-300 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 px-3 w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* APARTMENT NATURE & LOCATION */}
                <div className="mb-6 p-6 bg-green-50 rounded-2xl border border-green-100">
                    <h4 className="font-bold text-gray-900 mb-4">Apartment Nature & Location</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Nature of the Apartment</Label>
                            <select
                                value={formData.pdfDetails?.apartmentNature || ""}
                                onChange={(e) => handleValuationChange('apartmentNature', e.target.value)}
                                disabled={!canEdit}
                                className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                            >
                                <option value="">Select</option>
                                <option value="Residential">Residential</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Mixed">Mixed</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Location</Label>
                            <Input
                                placeholder="e.g., CIDCO"
                                value={formData.pdfDetails?.apartmentLocation || ""}
                                onChange={(e) => handleValuationChange('apartmentLocation', e.target.value)}
                                disabled={!canEdit}
                                className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">C.T.S. No.</Label>
                            <Input
                                placeholder="e.g., Plot number"
                                value={formData.pdfDetails?.apartmentCTSNo || ""}
                                onChange={(e) => handleValuationChange('apartmentCTSNo', e.target.value)}
                                disabled={!canEdit}
                                className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Sector No.</Label>
                            <Input
                                placeholder="e.g., 26"
                                value={formData.pdfDetails?.apartmentSectorNo || ""}
                                onChange={(e) => handleValuationChange('apartmentSectorNo', e.target.value)}
                                disabled={!canEdit}
                                className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Block No.</Label>
                            <Input
                                placeholder="e.g., A"
                                value={formData.pdfDetails?.apartmentBlockNo || ""}
                                onChange={(e) => handleValuationChange('apartmentBlockNo', e.target.value)}
                                disabled={!canEdit}
                                className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Ward No.</Label>
                            <Input
                                placeholder="e.g., --"
                                value={formData.pdfDetails?.apartmentWardNo || ""}
                                onChange={(e) => handleValuationChange('apartmentWardNo', e.target.value)}
                                disabled={!canEdit}
                                className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Village / Municipality / Corporation</Label>
                            <Input
                                placeholder="e.g., CIDCO"
                                value={formData.pdfDetails?.apartmentVillageMunicipalityCounty || ""}
                                onChange={(e) => handleValuationChange('apartmentVillageMunicipalityCounty', e.target.value)}
                                disabled={!canEdit}
                                className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Door No. / Street or Road</Label>
                            <Input
                                placeholder="e.g., Flat No. B-45/0:2"
                                value={formData.pdfDetails?.apartmentDoorNoStreetRoad || ""}
                                onChange={(e) => handleValuationChange('apartmentDoorNoStreetRoad', e.target.value)}
                                disabled={!canEdit}
                                className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Pin Code</Label>
                            <Input
                                placeholder="e.g., 400703"
                                value={formData.pdfDetails?.apartmentPinCode || ""}
                                onChange={(e) => handleValuationChange('apartmentPinCode', e.target.value)}
                                disabled={!canEdit}
                                className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                            />
                        </div>
                    </div>
                </div>

                {/* BUILDING & CONSTRUCTION DETAILS */}
                <div className="mb-6 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                    <h4 className="font-bold text-gray-900 mb-4">Building & Construction Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Description of the locality (Residential / Commercial / Mixed)</Label>
                            <select
                                value={formData.pdfDetails?.descriptionOfLocalityResidentialCommercialMixed || ""}
                                onChange={(e) => handleValuationChange('descriptionOfLocalityResidentialCommercialMixed', e.target.value)}
                                disabled={!canEdit}
                                className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                            >
                                <option value="">Select Type</option>
                                <option value="Residential">Residential</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Mixed">Mixed</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Year of Construction</Label>
                            <Input
                                placeholder="e.g., 1993"
                                value={formData.pdfDetails?.yearOfConstruction || ""}
                                onChange={(e) => handleValuationChange('yearOfConstruction', e.target.value)}
                                disabled={!canEdit}
                                className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Number of Floors</Label>
                            <Input
                                placeholder="e.g., 5"
                                value={formData.pdfDetails?.numberOfFloors || ""}
                                onChange={(e) => handleValuationChange('numberOfFloors', e.target.value)}
                                disabled={!canEdit}
                                className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Type of structure</Label>
                            <select
                                value={formData.pdfDetails?.typeOfStructure || ""}
                                onChange={(e) => handleValuationChange('typeOfStructure', e.target.value)}
                                disabled={!canEdit}
                                className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                            >
                                <option value="">Select Structure</option>
                                <option value="RCC Frame with Masonry">RCC Frame with Masonry</option>
                                <option value="Load bearing Masonry">Load bearing Masonry</option>
                                <option value="Steel Frame">Steel Frame</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Number of dwelling units in the building</Label>
                            <Input
                                placeholder="e.g., 10"
                                value={formData.pdfDetails?.numberOfDwellingUnitsInBuilding || ""}
                                onChange={(e) => handleValuationChange('numberOfDwellingUnitsInBuilding', e.target.value)}
                                disabled={!canEdit}
                                className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Quality of Construction</Label>
                            <select
                                value={formData.pdfDetails?.qualityOfConstruction || ""}
                                onChange={(e) => handleValuationChange('qualityOfConstruction', e.target.value)}
                                disabled={!canEdit}
                                className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                            >
                                <option value="">Select Quality</option>
                                <option value="Good">Good</option>
                                <option value="Average">Average</option>
                                <option value="Poor">Poor</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Appearance of the Building</Label>
                            <select
                                value={formData.pdfDetails?.appearanceOfBuilding || ""}
                                onChange={(e) => handleValuationChange('appearanceOfBuilding', e.target.value)}
                                disabled={!canEdit}
                                className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                            >
                                <option value="">Select Appearance</option>
                                <option value="Good">Good</option>
                                <option value="Average">Average</option>
                                <option value="Poor">Poor</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Maintenance of the Building</Label>
                            <select
                                value={formData.pdfDetails?.maintenanceOfBuilding || ""}
                                onChange={(e) => handleValuationChange('maintenanceOfBuilding', e.target.value)}
                                disabled={!canEdit}
                                className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                            >
                                <option value="">Select Maintenance</option>
                                <option value="Good">Good</option>
                                <option value="Average">Average</option>
                                <option value="Poor">Poor</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* FACILITIES AVAILABLE */}
                <div className="mb-6 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
                    <h4 className="font-bold text-gray-900 mb-4">Facilities Available</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Lift</Label>
                            <select value={formData.pdfDetails?.liftAvailable || ""} onChange={(e) => handleValuationChange('liftAvailable', e.target.value)} disabled={!canEdit} className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3">
                                <option value="">Select</option>
                                <option value="Available">Available</option>
                                <option value="Not Available">Not Available</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Protected water supply</Label>
                            <select value={formData.pdfDetails?.protectedWaterSupply || ""} onChange={(e) => handleValuationChange('protectedWaterSupply', e.target.value)} disabled={!canEdit} className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3">
                                <option value="">Select</option>
                                <option value="Available">Available</option>
                                <option value="Not Available">Not Available</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Underground Sewerage</Label>
                            <select value={formData.pdfDetails?.undergroundSewerage || ""} onChange={(e) => handleValuationChange('undergroundSewerage', e.target.value)} disabled={!canEdit} className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3">
                                <option value="">Select</option>
                                <option value="Available">Available</option>
                                <option value="Not Available">Not Available</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Car parking (Open/Covered)</Label>
                            <select value={formData.pdfDetails?.carParkingOpenCovered || ""} onChange={(e) => handleValuationChange('carParkingOpenCovered', e.target.value)} disabled={!canEdit} className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3">
                                <option value="">Select</option>
                                <option value="Open">Open</option>
                                <option value="Covered">Covered</option>
                                <option value="Not Available">Not Available</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Compound Wall</Label>
                            <select value={formData.pdfDetails?.isCompoundWallExisting || ""} onChange={(e) => handleValuationChange('isCompoundWallExisting', e.target.value)} disabled={!canEdit} className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3">
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Pavement around the building</Label>
                            <select value={formData.pdfDetails?.isPavementLaidAroundBuilding || ""} onChange={(e) => handleValuationChange('isPavementLaidAroundBuilding', e.target.value)} disabled={!canEdit} className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3">
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-900">Any others facility</Label>
                            <select value={formData.pdfDetails?.othersFacility || ""} onChange={(e) => handleValuationChange('othersFacility', e.target.value)} disabled={!canEdit} className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3">
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderMarketAnalysisTab = () => (
        <div className="space-y-6">
            {/* IV MARKETABILITY SECTION */}
            <div className="mb-6 p-6 bg-cyan-50 rounded-2xl border border-cyan-100">
                <h4 className="font-bold text-gray-900 mb-4 text-base">Marketability</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-900 block">Marketability</Label>
                        <Textarea
                            placeholder="e.g., Property is good..."
                            value={formData.pdfDetails?.marketability || ""}
                            onChange={(e) => handleValuationChange('marketability', e.target.value)}
                            disabled={!canEdit}
                            className="text-xs rounded-lg border border-neutral-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                            rows="2"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-900 block">Favoring Factors</Label>
                        <Textarea
                            placeholder="e.g., Amenities nearby..."
                            value={formData.pdfDetails?.favoringFactors || ""}
                            onChange={(e) => handleValuationChange('favoringFactors', e.target.value)}
                            disabled={!canEdit}
                            className="text-xs rounded-lg border border-neutral-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                            rows="2"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                        <Label className="text-xs font-bold text-gray-900 block">Negative Factors</Label>
                        <Textarea
                            placeholder="e.g., No negative factors"
                            value={formData.pdfDetails?.negativeFactors || ""}
                            onChange={(e) => handleValuationChange('negativeFactors', e.target.value)}
                            disabled={!canEdit}
                            className="text-xs rounded-lg border border-neutral-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                            rows="2"
                        />
                    </div>
                </div>
            </div>

            {/* RATE SECTION */}
            <div className="mb-6 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                <h4 className="font-bold text-gray-900 mb-4 text-base">Rate Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-900 block">Applicable Rate</Label>
                        <Textarea
                            placeholder="e.g., Rate per sq.ft..."
                            value={formData.pdfDetails?.marketabilityDescription || ""}
                            onChange={(e) => handleValuationChange('marketabilityDescription', e.target.value)}
                            disabled={!canEdit}
                            className="text-xs rounded-lg border border-neutral-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                            rows="2"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-900 block">Land Rate (New Const.)</Label>
                        <Textarea
                            placeholder="e.g., Land rate..."
                            value={formData.pdfDetails?.smallFlatDescription || ""}
                            onChange={(e) => handleValuationChange('smallFlatDescription', e.target.value)}
                            disabled={!canEdit}
                            className="text-xs rounded-lg border border-neutral-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                            rows="2"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                        <Label className="text-xs font-bold text-gray-900 block">Rate Adjustments</Label>
                        <Textarea
                            placeholder="e.g., Adjustments..."
                            value={formData.pdfDetails?.rateAdjustments || ""}
                            onChange={(e) => handleValuationChange('rateAdjustments', e.target.value)}
                            disabled={!canEdit}
                            className="text-xs rounded-lg border border-neutral-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                            rows="2"
                        />
                    </div>
                </div>
            </div>

            {/* BREAK-UP FOR THE RATE */}
            <div className="mb-6 p-6 bg-purple-50 rounded-2xl border border-purple-100">
                <h4 className="font-bold text-gray-900 mb-4"> Break-up for the above Rate</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Building + Services </Label>
                        <Input
                            placeholder="e.g., ₹ 3,000/- per Sq. ft."
                            value={formData.pdfDetails?.buildingServicesRate || ""}
                            onChange={(e) => handleValuationChange('buildingServicesRate', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Land + Other </Label>
                        <Input
                            placeholder="e.g., ₹ 15,000/- per Sq. ft."
                            value={formData.pdfDetails?.landOthersRate || ""}
                            onChange={(e) => handleValuationChange('landOthersRate', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>
            </div>

            {/* COMPOSITE RATE AFTER DEPRECIATION */}
            <div className="mb-6 p-6 bg-orange-50 rounded-2xl border border-orange-100">
                <h4 className="font-bold text-gray-900 mb-4">Composite Rate after depreciation</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Depreciation Building Date</Label>
                        <Input
                            type="date"
                            value={formData.pdfDetails?.depreciationBuildingDate || ""}
                            onChange={(e) => handleValuationChange('depreciationBuildingDate', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Replacement Cost Services</Label>
                        <Input
                            placeholder="e.g., ₹ Value"
                            value={formData.pdfDetails?.replacementCostServices || ""}
                            onChange={(e) => handleValuationChange('replacementCostServices', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Age of the Building/Assumed</Label>
                        <Input
                            placeholder="e.g., 42 years"
                            value={formData.pdfDetails?.buildingAge || ""}
                            onChange={(e) => handleValuationChange('buildingAge', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Future Life of Building estimated</Label>
                        <Input
                            placeholder="e.g., 18 years"
                            value={formData.pdfDetails?.buildingLife || ""}
                            onChange={(e) => handleValuationChange('buildingLife', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Depreciation percentage</Label>
                        <Input
                            placeholder="e.g., 58 %"
                            value={formData.pdfDetails?.depreciationPercentage || ""}
                            onChange={(e) => handleValuationChange('depreciationPercentage', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Depreciation Rate of the building </Label>
                        <Input
                            placeholder="e.g., Value"
                            value={formData.pdfDetails?.depreciationStorage || ""}
                            onChange={(e) => handleValuationChange('depreciationStorage', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>
            </div>

            {/* TOTAL COMPOSITE RATE */}
            <div className="mb-6 p-6 bg-green-50 rounded-2xl border border-green-100">
                <h4 className="font-bold text-gray-900 mb-4">Total Composite Rate</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Total Composite Rate</Label>
                        <Input
                            placeholder="e.g., ₹ Value"
                            value={formData.pdfDetails?.totalCompositeRate || ""}
                            onChange={(e) => handleValuationChange('totalCompositeRate', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Depreciated Building Rate</Label>
                        <Input
                            placeholder="e.g., ₹ Value per Sq. ft."
                            value={formData.pdfDetails?.depreciatedBuildingRate || ""}
                            onChange={(e) => handleValuationChange('depreciatedBuildingRate', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Rate for Land & Other</Label>
                        <Input
                            placeholder="e.g., ₹ Value"
                            value={formData.pdfDetails?.rateForLandOther || ""}
                            onChange={(e) => handleValuationChange('rateForLandOther', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>
            </div>

            {/* FLAT/UNIT SPECIFICATIONS */}
            <div className="mb-6 p-6 bg-sky-50 rounded-2xl border border-sky-100">
                <h4 className="font-bold text-gray-900 mb-4">Unit Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">The floor in which the Unit is situated</Label>
                        <select
                            value={formData.pdfDetails?.unitFloor || ""}
                            onChange={(e) => handleValuationChange('unitFloor', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select Floor</option>
                            <option value="Ground">Ground</option>
                            <option value="1st">1st</option>
                            <option value="2nd">2nd</option>
                            <option value="3rd">3rd</option>
                            <option value="Higher">Higher</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Door Number of the Flat</Label>
                        <Input
                            placeholder="e.g., Flat No. B-402"
                            value={formData.pdfDetails?.unitDoorNo || ""}
                            onChange={(e) => handleValuationChange('unitDoorNo', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Specifications - Roof</Label>
                        <Input
                            placeholder="e.g., RCC"
                            value={formData.pdfDetails?.unitRoof || ""}
                            onChange={(e) => handleValuationChange('unitRoof', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Specifications - Flooring</Label>
                        <Input
                            placeholder="e.g., Marble/Tiles"
                            value={formData.pdfDetails?.unitFlooring || ""}
                            onChange={(e) => handleValuationChange('unitFlooring', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Specifications - Doors & Windows</Label>
                        <Input
                            placeholder="e.g., Details"
                            value={formData.pdfDetails?.unitDoors || ""}
                            onChange={(e) => handleValuationChange('unitDoors', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">Specifications - Bath & WC</Label>
                        <Input
                            placeholder="e.g., Details"
                            value={formData.pdfDetails?.unitBathAndWC || ""}
                            onChange={(e) => handleValuationChange('unitBathAndWC', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">Specifications - Electrical Wiring</Label>
                        <Input
                            placeholder="e.g., Details"
                            value={formData.pdfDetails?.unitElectricalWiring || ""}
                            onChange={(e) => handleValuationChange('unitElectricalWiring', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">Specification of the Flat</Label>
                        <Input
                            placeholder="e.g., 1RK, 2BHK, 3BHK"
                            value={formData.pdfDetails?.unitSpecification || ""}
                            onChange={(e) => handleValuationChange('unitSpecification', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">Specifications - Fittings</Label>
                        <Input
                            placeholder="e.g., Details"
                            value={formData.pdfDetails?.unitFittings || ""}
                            onChange={(e) => handleValuationChange('unitFittings', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">Specifications - Finishing</Label>
                        <Input
                            placeholder="e.g., Details"
                            value={formData.pdfDetails?.unitFinishing || ""}
                            onChange={(e) => handleValuationChange('unitFinishing', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                </div>
            </div>

            {/* ELECTRICITY SERVICE */}
            <div className="mb-6 p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
                <h4 className="font-bold text-gray-900 mb-4">Electricity Service Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Electricity service connection number Meter
                            card is in the name of </Label>
                        <Input
                            placeholder="e.g., Service Number"
                            value={formData.pdfDetails?.electricityServiceNo || ""}
                            onChange={(e) => handleValuationChange('electricityServiceNo', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                </div>
            </div>

            {/* UNIT TAX/ASSESSMENT */}
            <div className="mb-6 p-6 bg-lime-50 rounded-2xl border border-lime-100">
                <h4 className="font-bold text-gray-900 mb-4">Unit Tax & Assessment</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Assessment No.</Label>
                        <Input
                            placeholder="e.g., Assessment No."
                            value={formData.pdfDetails?.assessmentNo || ""}
                            onChange={(e) => handleValuationChange('assessmentNo', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Tax Paid Name</Label>
                        <Input
                            placeholder="e.g., Name"
                            value={formData.pdfDetails?.taxPaidName || ""}
                            onChange={(e) => handleValuationChange('taxPaidName', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Tax Amount</Label>
                        <Input
                            placeholder="e.g., Amount"
                            value={formData.pdfDetails?.taxAmount || ""}
                            onChange={(e) => handleValuationChange('taxAmount', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>
            </div>

            {/* AGREEMENT FOR SALE */}
            <div className="mb-6 p-6 bg-pink-50 rounded-2xl border border-pink-100">
                <h4 className="font-bold text-gray-900 mb-4">Agreement for Sale</h4>
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Agreement for Sale executed Name</Label>
                        <Input
                            placeholder="e.g., Agreement Name/Details"
                            value={formData.pdfDetails?.agreementSaleExecutedName || ""}
                            onChange={(e) => handleValuationChange('agreementSaleExecutedName', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>
            </div>

            {/* UNIT AREA DETAILS */}
            <div className="mb-6 p-6 bg-orange-50 rounded-2xl border border-orange-100">
                <h4 className="font-bold text-gray-900 mb-4">Area Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">What is the undivided area of the land as per
                            sale deed ? </Label>
                        <Input
                            placeholder="e.g., Area in Sq. ft."
                            value={formData.pdfDetails?.undividedAreaLand || ""}
                            onChange={(e) => handleValuationChange('undividedAreaLand', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Plinth Area of Flat </Label>
                        <Input
                            placeholder="e.g., 278.57 Sq ft"
                            value={formData.pdfDetails?.plinthArea || ""}
                            onChange={(e) => handleValuationChange('plinthArea', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">Carpet Area of Flat</Label>
                        <Input
                            placeholder="e.g., Area in Sq. ft."
                            value={formData.pdfDetails?.carpetArea || ""}
                            onChange={(e) => handleValuationChange('carpetArea', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">What is the floor space index?</Label>
                        <Input
                            placeholder="e.g., FSI value"
                            value={formData.pdfDetails?.floorSpaceIndex || ""}
                            onChange={(e) => handleValuationChange('floorSpaceIndex', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>
            </div>

            {/* UNIT MAINTENANCE */}
            <div className="mb-6 p-6 bg-fuchsia-50 rounded-2xl border border-fuchsia-100">
                <h4 className="font-bold text-gray-900 mb-4">Unit Maintenance</h4>
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">How is the maintenance of the Flat ?</Label>
                        <select
                            value={formData.pdfDetails?.unitMaintenance || ""}
                            onChange={(e) => handleValuationChange('unitMaintenance', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-3"
                        >
                            <option value="">Select</option>
                            <option value="Good">Good</option>
                            <option value="Average">Average</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* UNIT CLASSIFICATION */}
            <div className="mb-6 p-6 bg-purple-50 rounded-2xl border border-purple-100">
                <h4 className="font-bold text-gray-900 mb-4">Unit Classification</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Classification - Posh</Label>
                        <Input
                            placeholder="e.g., Details"
                            value={formData.pdfDetails?.classificationPosh || ""}
                            onChange={(e) => handleValuationChange('classificationPosh', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Classification - Usage</Label>
                        <Input
                            placeholder="e.g., Residential/Commercial"
                            value={formData.pdfDetails?.classificationUsage || ""}
                            onChange={(e) => handleValuationChange('classificationUsage', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">Is it owner occupied or tenanted?</Label>
                        <select
                            value={formData.pdfDetails?.ownerOccupancyStatus || ""}
                            onChange={(e) => handleValuationChange('ownerOccupancyStatus', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-3"
                        >
                            <option value="">Select</option>
                            <option value="Owner Occupied">Owner Occupied</option>
                            <option value="Tenanted">Tenanted</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">If tenanted, what is the monthly rent?</Label>
                        <Input
                            placeholder="e.g., Amount"
                            value={formData.pdfDetails?.monthlyRent || ""}
                            onChange={(e) => handleValuationChange('monthlyRent', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderBuildingTab = () => (
        <div className="space-y-6">
            {/* APARTMENT NATURE & LOCATION */}
            <div className="mb-6 p-6 bg-green-50 rounded-2xl border border-green-100">
                <h4 className="font-bold text-gray-900 mb-4">Apartment Nature & Location</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Nature of the Apartment</Label>
                        <select
                            value={formData.pdfDetails?.apartmentNature || ""}
                            onChange={(e) => handleValuationChange('apartmentNature', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select</option>
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Mixed">Mixed</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Location</Label>
                        <Input
                            placeholder="e.g., CIDCO"
                            value={formData.pdfDetails?.apartmentLocation || ""}
                            onChange={(e) => handleValuationChange('apartmentLocation', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">C.T.S. No.</Label>
                        <Input
                            placeholder="e.g., Plot number"
                            value={formData.pdfDetails?.apartmentCTSNo || ""}
                            onChange={(e) => handleValuationChange('apartmentCTSNo', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Sector No.</Label>
                        <Input
                            placeholder="e.g., 26"
                            value={formData.pdfDetails?.apartmentSectorNo || ""}
                            onChange={(e) => handleValuationChange('apartmentSectorNo', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Block No.</Label>
                        <Input
                            placeholder="e.g., A"
                            value={formData.pdfDetails?.apartmentBlockNo || ""}
                            onChange={(e) => handleValuationChange('apartmentBlockNo', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Ward No.</Label>
                        <Input
                            placeholder="e.g., --"
                            value={formData.pdfDetails?.apartmentWardNo || ""}
                            onChange={(e) => handleValuationChange('apartmentWardNo', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Village / Municipality / Corporation</Label>
                        <Input
                            placeholder="e.g., CIDCO"
                            value={formData.pdfDetails?.apartmentVillageMunicipalityCounty || ""}
                            onChange={(e) => handleValuationChange('apartmentVillageMunicipalityCounty', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Door No. / Street or Road</Label>
                        <Input
                            placeholder="e.g., Flat No. B-45/0:2"
                            value={formData.pdfDetails?.apartmentDoorNoStreetRoad || ""}
                            onChange={(e) => handleValuationChange('apartmentDoorNoStreetRoad', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Pin Code</Label>
                        <Input
                            placeholder="e.g., 400703"
                            value={formData.pdfDetails?.apartmentPinCode || ""}
                            onChange={(e) => handleValuationChange('apartmentPinCode', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                </div>
            </div>

            {/* BUILDING & CONSTRUCTION DETAILS */}
            <div className="mb-6 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                <h4 className="font-bold text-gray-900 mb-4">Building & Construction Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Description of the locality (Residential / Commercial / Mixed)</Label>
                        <select
                            value={formData.pdfDetails?.descriptionOfLocalityResidentialCommercialMixed || ""}
                            onChange={(e) => handleValuationChange('descriptionOfLocalityResidentialCommercialMixed', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select Type</option>
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Mixed">Mixed</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Year of Construction</Label>
                        <Input
                            placeholder="e.g., 1993"
                            value={formData.pdfDetails?.yearOfConstruction || ""}
                            onChange={(e) => handleValuationChange('yearOfConstruction', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Number of Floors</Label>
                        <Input
                            placeholder="e.g., 5"
                            value={formData.pdfDetails?.numberOfFloors || ""}
                            onChange={(e) => handleValuationChange('numberOfFloors', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Type of structure</Label>
                        <select
                            value={formData.pdfDetails?.typeOfStructure || ""}
                            onChange={(e) => handleValuationChange('typeOfStructure', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select Structure</option>
                            <option value="RCC Frame with Masonry">RCC Frame with Masonry</option>
                            <option value="Load bearing Masonry">Load bearing Masonry</option>
                            <option value="Steel Frame">Steel Frame</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Number of dwelling units in the building</Label>
                        <Input
                            placeholder="e.g., 10"
                            value={formData.pdfDetails?.numberOfDwellingUnitsInBuilding || ""}
                            onChange={(e) => handleValuationChange('numberOfDwellingUnitsInBuilding', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Quality of Construction</Label>
                        <select
                            value={formData.pdfDetails?.qualityOfConstruction || ""}
                            onChange={(e) => handleValuationChange('qualityOfConstruction', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select Quality</option>
                            <option value="Good">Good</option>
                            <option value="Average">Average</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Appearance of the Building</Label>
                        <select
                            value={formData.pdfDetails?.appearanceOfBuilding || ""}
                            onChange={(e) => handleValuationChange('appearanceOfBuilding', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select Appearance</option>
                            <option value="Good">Good</option>
                            <option value="Average">Average</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Maintenance of the Building</Label>
                        <select
                            value={formData.pdfDetails?.maintenanceOfBuilding || ""}
                            onChange={(e) => handleValuationChange('maintenanceOfBuilding', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select Maintenance</option>
                            <option value="Good">Good</option>
                            <option value="Average">Average</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* FACILITIES AVAILABLE */}
            <div className="mb-6 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
                <h4 className="font-bold text-gray-900 mb-4">Facilities Available</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Lift</Label>
                        <select value={formData.pdfDetails?.liftAvailable || ""} onChange={(e) => handleValuationChange('liftAvailable', e.target.value)} disabled={!canEdit} className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3">
                            <option value="">Select</option>
                            <option value="Available">Available</option>
                            <option value="Not Available">Not Available</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Protected water supply</Label>
                        <select value={formData.pdfDetails?.protectedWaterSupply || ""} onChange={(e) => handleValuationChange('protectedWaterSupply', e.target.value)} disabled={!canEdit} className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3">
                            <option value="">Select</option>
                            <option value="Available">Available</option>
                            <option value="Not Available">Not Available</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Underground Sewerage</Label>
                        <select value={formData.pdfDetails?.undergroundSewerage || ""} onChange={(e) => handleValuationChange('undergroundSewerage', e.target.value)} disabled={!canEdit} className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3">
                            <option value="">Select</option>
                            <option value="Available">Available</option>
                            <option value="Not Available">Not Available</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Car parking (Open/Covered)</Label>
                        <select value={formData.pdfDetails?.carParkingOpenCovered || ""} onChange={(e) => handleValuationChange('carParkingOpenCovered', e.target.value)} disabled={!canEdit} className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3">
                            <option value="">Select</option>
                            <option value="Open">Open</option>
                            <option value="Covered">Covered</option>
                            <option value="Not Available">Not Available</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Compound Wall</Label>
                        <select value={formData.pdfDetails?.isCompoundWallExisting || ""} onChange={(e) => handleValuationChange('isCompoundWallExisting', e.target.value)} disabled={!canEdit} className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3">
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">Pavement around the building</Label>
                        <select value={formData.pdfDetails?.isPavementLaidAroundBuilding || ""} onChange={(e) => handleValuationChange('isPavementLaidAroundBuilding', e.target.value)} disabled={!canEdit} className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3">
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">Any others facility</Label>
                        <select value={formData.pdfDetails?.othersFacility || ""} onChange={(e) => handleValuationChange('othersFacility', e.target.value)} disabled={!canEdit} className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3">
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPropertyTab = () => (
        <div className="space-y-6">
            {/* PROPERTY LOCATION & DESCRIPTION */}
            <div className="mb-6 p-6 bg-cyan-50 rounded-2xl border border-cyan-100">
                <h4 className="font-bold text-gray-900 mb-4">Location of the property</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">a) Plot No./ Survey No.</Label>
                        <Input
                            placeholder="e.g., S. No. 26"
                            value={formData.pdfDetails?.plotSurveyNo || ""}
                            onChange={(e) => handleValuationChange('plotSurveyNo', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">b) Door No.</Label>
                        <Input
                            placeholder="e.g., Hali No. B-4502"
                            value={formData.pdfDetails?.doorNo || ""}
                            onChange={(e) => handleValuationChange('doorNo', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">c) T.S. No./Village</Label>
                        <Input
                            placeholder="e.g., Yasai"
                            value={formData.pdfDetails?.tpVillage || ""}
                            onChange={(e) => handleValuationChange('tpVillage', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">d) Ward/Taluka</Label>
                        <Input
                            placeholder="e.g., Taluka"
                            value={formData.pdfDetails?.wardTaluka || ""}
                            onChange={(e) => handleValuationChange('wardTaluka', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">e) District</Label>
                        <Input
                            placeholder="e.g., District"
                            value={formData.pdfDetails?.mandalDistrict || ""}
                            onChange={(e) => handleValuationChange('mandalDistrict', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">f) Date of issue and validity of layout plan</Label>
                        <Input
                            type="date"
                            value={formData.pdfDetails?.layoutPlanIssueDate || ""}
                            onChange={(e) => handleValuationChange('layoutPlanIssueDate', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">g) Approved map/plan issuing authority </Label>
                        <Input
                            placeholder="e.g., CIDCO"
                            value={formData.pdfDetails?.approvedMapAuthority || ""}
                            onChange={(e) => handleValuationChange('approvedMapAuthority', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">h) Whether authenticity of approved map/plan is verified</Label>
                        <select
                            value={formData.pdfDetails?.authenticityVerified || ""}
                            onChange={(e) => handleValuationChange('authenticityVerified', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select Status</option>
                            <option value="Verified">Yes</option>
                            <option value="Not Verified">Not</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">i) Any other conveniences provided by our approved plan</Label>
                        <Textarea
                            placeholder="e.g., Parking, Amenities, etc."
                            value={formData.pdfDetails?.otherApprovedPlanDetails || ""}
                            onChange={(e) => handleValuationChange('otherApprovedPlanDetails', e.target.value)}
                            disabled={!canEdit}
                            className="text-sm rounded-lg border border-neutral-300"
                            rows="2"
                        />
                    </div>


                </div>
            </div>

            {/* POSTAL ADDRESS & CLASSIFICATION */}
            <div className="mb-6 p-6 bg-violet-50 rounded-2xl border border-violet-100">
                <h4 className="font-bold text-gray-900 mb-4">Property Classification & Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Postal Address of the property</Label>
                        <Textarea
                            placeholder="Enter full address"
                            value={formData.pdfDetails?.postalAddress || ""}
                            onChange={(e) => handleValuationChange('postalAddress', e.target.value)}
                            disabled={!canEdit}
                            className="text-sm rounded-lg border border-neutral-300"
                            rows="3"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">City/Town</Label>
                        <Input
                            placeholder="e.g., Mumbai"
                            value={formData.pdfDetails?.cityTown || ""}
                            onChange={(e) => handleValuationChange('cityTown', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                </div>
                <div className="mt-4 space-y-3">
                    <Label className="text-sm font-bold text-gray-900">Area Type</Label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.pdfDetails?.residentialArea || false}
                                onChange={(e) => handleValuationChange('residentialArea', e.target.checked)}
                                disabled={!canEdit}
                                className="w-4 h-4 rounded"
                            />
                            <span className="text-sm">Residential Area</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.pdfDetails?.commercialArea || false}
                                onChange={(e) => handleValuationChange('commercialArea', e.target.checked)}
                                disabled={!canEdit}
                                className="w-4 h-4 rounded"
                            />
                            <span className="text-sm">Commercial Area</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.pdfDetails?.industrialArea || false}
                                onChange={(e) => handleValuationChange('industrialArea', e.target.checked)}
                                disabled={!canEdit}
                                className="w-4 h-4 rounded"
                            />
                            <span className="text-sm">Industrial Area</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* BOUNDARIES OF PROPERTY */}
            <div className="mb-6 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <h4 className="font-bold text-gray-900 mb-4">Boundaries of Property</h4>
                <div className="space-y-6">
                    {/* Plot Boundaries Table */}
                    <div>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-indigo-100">
                                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-900 w-1/4">a</th>
                                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-900 w-1/4">Boundaries of the property - Plot</th>
                                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-900 w-1/4">As per Deed</th>
                                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-900 w-1/4">As per Actual</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="1" className="border border-gray-300 p-3"></td>
                                    <td className="border border-gray-300 p-3 font-semibold text-gray-800">North</td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesPlotNorthDeed || ""}
                                            onChange={(e) => handleValuationChange('boundariesPlotNorthDeed', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesPlotNorthActual || ""}
                                            onChange={(e) => handleValuationChange('boundariesPlotNorthActual', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className="border border-gray-300 p-3"></td>
                                    <td className="border border-gray-300 p-3 font-semibold text-gray-800">South</td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesPlotSouthDeed || ""}
                                            onChange={(e) => handleValuationChange('boundariesPlotSouthDeed', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesPlotSouthActual || ""}
                                            onChange={(e) => handleValuationChange('boundariesPlotSouthActual', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className="border border-gray-300 p-3"></td>
                                    <td className="border border-gray-300 p-3 font-semibold text-gray-800">East</td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesPlotEastDeed || ""}
                                            onChange={(e) => handleValuationChange('boundariesPlotEastDeed', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesPlotEastActual || ""}
                                            onChange={(e) => handleValuationChange('boundariesPlotEastActual', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className="border border-gray-300 p-3"></td>
                                    <td className="border border-gray-300 p-3 font-semibold text-gray-800">West</td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesPlotWestDeed || ""}
                                            onChange={(e) => handleValuationChange('boundariesPlotWestDeed', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesPlotWestActual || ""}
                                            onChange={(e) => handleValuationChange('boundariesPlotWestActual', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Flat/Shop Boundaries Table */}
                    <div>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-indigo-100">
                                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-900 w-1/4">b</th>
                                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-900 w-1/4">Boundaries of the property - Flat</th>
                                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-900 w-1/4">As per Deed</th>
                                    <th className="border border-gray-300 p-3 text-left font-bold text-gray-900 w-1/4">As per Actual</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="1" className="border border-gray-300 p-3"></td>
                                    <td className="border border-gray-300 p-3 font-semibold text-gray-800">North</td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesShopNorthDeed || ""}
                                            onChange={(e) => handleValuationChange('boundariesShopNorthDeed', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesShopNorthActual || ""}
                                            onChange={(e) => handleValuationChange('boundariesShopNorthActual', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className="border border-gray-300 p-3"></td>
                                    <td className="border border-gray-300 p-3 font-semibold text-gray-800">South</td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesShopSouthDeed || ""}
                                            onChange={(e) => handleValuationChange('boundariesShopSouthDeed', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesShopSouthActual || ""}
                                            onChange={(e) => handleValuationChange('boundariesShopSouthActual', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className="border border-gray-300 p-3"></td>
                                    <td className="border border-gray-300 p-3 font-semibold text-gray-800">East</td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesShopEastDeed || ""}
                                            onChange={(e) => handleValuationChange('boundariesShopEastDeed', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesShopEastActual || ""}
                                            onChange={(e) => handleValuationChange('boundariesShopEastActual', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="1" className="border border-gray-300 p-3"></td>
                                    <td className="border border-gray-300 p-3 font-semibold text-gray-800">West</td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesShopWestDeed || ""}
                                            onChange={(e) => handleValuationChange('boundariesShopWestDeed', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <Input
                                            placeholder="NA"
                                            value={formData.pdfDetails?.boundariesShopWestActual || ""}
                                            onChange={(e) => handleValuationChange('boundariesShopWestActual', e.target.value)}
                                            disabled={!canEdit}
                                            className="h-9 text-sm rounded-lg border border-neutral-300"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* DIMENSIONS OF THE PROPERTY */}
            <div className="mb-6 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-4">Dimensions of the Unit</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Dimensions (as per Document)</Label>
                        <Input
                            placeholder="e.g., 28.88 Sq. ft. / 2.88 Sq. ft."
                            value={formData.pdfDetails?.dimensionsDeed || ""}
                            onChange={(e) => handleValuationChange('dimensionsDeed', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Dimensions (as per Actuals)</Label>
                        <Input
                            placeholder="e.g., 28.88 Sq. ft. / 2.88 Sq. ft."
                            value={formData.pdfDetails?.dimensionsActual || ""}
                            onChange={(e) => handleValuationChange('dimensionsActual', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                </div>
            </div>

            {/* EXTENT OF THE UNIT */}
            <div className="mb-6 p-6 bg-green-50 rounded-2xl border border-green-100">
                <h4 className="font-bold text-gray-900 mb-4">Extent of the site</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Extent of Site</Label>
                        <Input
                            placeholder="e.g., ₹ 40,34,950 per Sq. ft."
                            value={formData.pdfDetails?.extentOfUnit || ""}
                            onChange={(e) => handleValuationChange('extentOfUnit', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Latitude/Longitude</Label>
                        <Input
                            placeholder="e.g., 19°07'53.2 N & 73°00"
                            value={formData.pdfDetails?.latitudeLongitude || ""}
                            onChange={(e) => handleValuationChange('latitudeLongitude', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>

                </div>
            </div>

            {/* EXTENT OF SITE & RENT */}
            <div className="mb-6 p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
                <h4 className="font-bold text-gray-900 mb-4">Extent & Occupancy Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Extent of Site Considered for Valuation</Label>
                        <Input
                            placeholder="e.g., Area in Sq. ft."
                            value={formData.pdfDetails?.extentOfSiteValuation || ""}
                            onChange={(e) => handleValuationChange('extentOfSiteValuation', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Whether occupied by the owner/tenant? If occupied by tenant, since how long? Rent
                            received per month </Label>
                        <Input
                            placeholder="Owner/ Tenant & Rent Amount"
                            value={formData.pdfDetails?.rentReceivedPerMonth || ""}
                            onChange={(e) => handleValuationChange('rentReceivedPerMonth', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                </div>
            </div>

            {/* AREA CLASSIFICATION */}
            <div className="mb-6 p-6 bg-teal-50 rounded-2xl border border-teal-100">
                <h4 className="font-bold text-gray-900 mb-4">Area Classification</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">High/Middle/Poor</Label>
                        <select
                            value={formData.pdfDetails?.areaClassification || ""}
                            onChange={(e) => handleValuationChange('areaClassification', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select</option>
                            <option value="High">High</option>
                            <option value="Middle">Middle</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Metro / Urban / Semi-Urban / Rural</Label>
                        <select
                            value={formData.pdfDetails?.urbanClassification || ""}
                            onChange={(e) => handleValuationChange('urbanClassification', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select</option>
                            <option value="Metro">Metro</option>
                            <option value="Urban">Urban</option>
                            <option value="Semi-Urban">Semi-Urban</option>
                            <option value="Rural">Rural</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Government Type / Comming Under</Label>
                        <select
                            value={formData.pdfDetails?.governmentType || ""}
                            onChange={(e) => handleValuationChange('governmentType', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select Type</option>
                            <option value="Municipal">Municipality</option>
                            <option value="Corporation">Corporation</option>
                            <option value="Government">Government</option>
                            <option value="Village Panchayat">Village Panchayat</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Whether covered under any Govt. Enactments</Label>
                        <select
                            value={formData.pdfDetails?.govtEnactmentsCovered || ""}
                            onChange={(e) => handleValuationChange('govtEnactmentsCovered', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderFlatTab = () => (
        <div className="space-y-6">
            {/* FLAT/UNIT SPECIFICATIONS */}
            <div className="mb-6 p-6 bg-sky-50 rounded-2xl border border-sky-100">
                <h4 className="font-bold text-gray-900 mb-4">Unit Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">The floor in which the Unit is situated</Label>
                        <select
                            value={formData.pdfDetails?.unitFloor || ""}
                            onChange={(e) => handleValuationChange('unitFloor', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white px-3"
                        >
                            <option value="">Select Floor</option>
                            <option value="Ground">Ground</option>
                            <option value="1st">1st</option>
                            <option value="2nd">2nd</option>
                            <option value="3rd">3rd</option>
                            <option value="Higher">Higher</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Door Number of the Flat</Label>
                        <Input
                            placeholder="e.g., Flat No. B-402"
                            value={formData.pdfDetails?.unitDoorNo || ""}
                            onChange={(e) => handleValuationChange('unitDoorNo', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Specifications - Roof</Label>
                        <Input
                            placeholder="e.g., RCC"
                            value={formData.pdfDetails?.unitRoof || ""}
                            onChange={(e) => handleValuationChange('unitRoof', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Specifications - Flooring</Label>
                        <Input
                            placeholder="e.g., Marble/Tiles"
                            value={formData.pdfDetails?.unitFlooring || ""}
                            onChange={(e) => handleValuationChange('unitFlooring', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Specifications - Doors & Windows</Label>
                        <Input
                            placeholder="e.g., Details"
                            value={formData.pdfDetails?.unitDoors || ""}
                            onChange={(e) => handleValuationChange('unitDoors', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">Specifications - Bath & WC</Label>
                        <Input
                            placeholder="e.g., Details"
                            value={formData.pdfDetails?.unitBathAndWC || ""}
                            onChange={(e) => handleValuationChange('unitBathAndWC', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">Specifications - Electrical Wiring</Label>
                        <Input
                            placeholder="e.g., Details"
                            value={formData.pdfDetails?.unitElectricalWiring || ""}
                            onChange={(e) => handleValuationChange('unitElectricalWiring', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">Specification of the Flat</Label>
                        <Input
                            placeholder="e.g., 1RK, 2BHK, 3BHK"
                            value={formData.pdfDetails?.unitSpecification || ""}
                            onChange={(e) => handleValuationChange('unitSpecification', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">Specifications - Fittings</Label>
                        <Input
                            placeholder="e.g., Details"
                            value={formData.pdfDetails?.unitFittings || ""}
                            onChange={(e) => handleValuationChange('unitFittings', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">Specifications - Finishing</Label>
                        <Input
                            placeholder="e.g., Details"
                            value={formData.pdfDetails?.unitFinishing || ""}
                            onChange={(e) => handleValuationChange('unitFinishing', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2"
                        />
                    </div>
                </div>
            </div>

            {/* ELECTRICITY SERVICE */}
            <div className="mb-6 p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
                <h4 className="font-bold text-gray-900 mb-4">Electricity Service Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Electricity service connection number Meter
                            card is in the name of </Label>
                        <Input
                            placeholder="e.g., Service Number"
                            value={formData.pdfDetails?.electricityServiceNo || ""}
                            onChange={(e) => handleValuationChange('electricityServiceNo', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                </div>
            </div>

            {/* UNIT TAX/ASSESSMENT */}
            <div className="mb-6 p-6 bg-lime-50 rounded-2xl border border-lime-100">
                <h4 className="font-bold text-gray-900 mb-4">Unit Tax & Assessment</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Assessment No.</Label>
                        <Input
                            placeholder="e.g., Assessment No."
                            value={formData.pdfDetails?.assessmentNo || ""}
                            onChange={(e) => handleValuationChange('assessmentNo', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Tax Paid Name</Label>
                        <Input
                            placeholder="e.g., Name"
                            value={formData.pdfDetails?.taxPaidName || ""}
                            onChange={(e) => handleValuationChange('taxPaidName', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Tax Amount</Label>
                        <Input
                            placeholder="e.g., Amount"
                            value={formData.pdfDetails?.taxAmount || ""}
                            onChange={(e) => handleValuationChange('taxAmount', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>
            </div>

            {/* AGREEMENT FOR SALE */}
            <div className="mb-6 p-6 bg-pink-50 rounded-2xl border border-pink-100">
                <h4 className="font-bold text-gray-900 mb-4">Agreement for Sale</h4>
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Agreement for Sale executed Name</Label>
                        <Input
                            placeholder="e.g., Agreement Name/Details"
                            value={formData.pdfDetails?.agreementSaleExecutedName || ""}
                            onChange={(e) => handleValuationChange('agreementSaleExecutedName', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>
            </div>

            {/* UNIT AREA DETAILS */}
            <div className="mb-6 p-6 bg-orange-50 rounded-2xl border border-orange-100">
                <h4 className="font-bold text-gray-900 mb-4">Area Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">What is the undivided area of the land as per
                            sale deed ? </Label>
                        <Input
                            placeholder="e.g., Area in Sq. ft."
                            value={formData.pdfDetails?.undividedAreaLand || ""}
                            onChange={(e) => handleValuationChange('undividedAreaLand', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Plinth Area of Flat </Label>
                        <Input
                            placeholder="e.g., 278.57 Sq ft"
                            value={formData.pdfDetails?.plinthArea || ""}
                            onChange={(e) => handleValuationChange('plinthArea', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">Carpet Area of Flat</Label>
                        <Input
                            placeholder="e.g., Area in Sq. ft."
                            value={formData.pdfDetails?.carpetArea || ""}
                            onChange={(e) => handleValuationChange('carpetArea', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">What is the floor space index?</Label>
                        <Input
                            placeholder="e.g., FSI value"
                            value={formData.pdfDetails?.floorSpaceIndex || ""}
                            onChange={(e) => handleValuationChange('floorSpaceIndex', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>
            </div>

            {/* UNIT MAINTENANCE */}
            <div className="mb-6 p-6 bg-fuchsia-50 rounded-2xl border border-fuchsia-100">
                <h4 className="font-bold text-gray-900 mb-4">Unit Maintenance</h4>
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">How is the maintenance of the Flat ?</Label>
                        <select
                            value={formData.pdfDetails?.unitMaintenance || ""}
                            onChange={(e) => handleValuationChange('unitMaintenance', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-3"
                        >
                            <option value="">Select</option>
                            <option value="Good">Good</option>
                            <option value="Average">Average</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* UNIT CLASSIFICATION */}
            <div className="mb-6 p-6 bg-purple-50 rounded-2xl border border-purple-100">
                <h4 className="font-bold text-gray-900 mb-4">Unit Classification</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Classification - Posh</Label>
                        <Input
                            placeholder="e.g., Details"
                            value={formData.pdfDetails?.classificationPosh || ""}
                            onChange={(e) => handleValuationChange('classificationPosh', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-gray-900">Classification - Usage</Label>
                        <Input
                            placeholder="e.g., Residential/Commercial"
                            value={formData.pdfDetails?.classificationUsage || ""}
                            onChange={(e) => handleValuationChange('classificationUsage', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">Is it owner occupied or tenanted?</Label>
                        <select
                            value={formData.pdfDetails?.ownerOccupancyStatus || ""}
                            onChange={(e) => handleValuationChange('ownerOccupancyStatus', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-3"
                        >
                            <option value="">Select</option>
                            <option value="Owner Occupied">Owner Occupied</option>
                            <option value="Tenanted">Tenanted</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-900">If tenanted, what is the monthly rent?</Label>
                        <Input
                            placeholder="e.g., Amount"
                            value={formData.pdfDetails?.monthlyRent || ""}
                            onChange={(e) => handleValuationChange('monthlyRent', e.target.value)}
                            disabled={!canEdit}
                            className="h-8 text-xs rounded-lg border border-neutral-300 py-1 px-2 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    if (!valuation) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-80">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-muted-foreground">Loading valuation...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-4">
            {!isLoggedIn && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-8 max-w-sm border border-neutral-200 shadow-lg">
                        <p className="text-center font-semibold text-base text-neutral-900">Please login to edit this valuation</p>
                        <p className="text-center text-sm text-neutral-600 mt-3">You are currently viewing in read-only mode</p>
                    </div>
                </div>
            )}

            <div className="max-w-full mx-auto">

                {/* Header */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-200">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                            navigate("/dashboard");
                        }}
                        className="h-9 w-9 border border-neutral-300 hover:bg-neutral-100 hover:border-blue-400 rounded-lg p-0 transition-colors"
                    >
                        <FaArrowLeft className="h-4 w-4 text-neutral-700" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">UBI APF Form</h1>
                        <p className="text-xs text-neutral-500 mt-1">{!isLoggedIn && "Read-Only Mode"}</p>
                    </div>
                </div>

                {/* Main Content - 2-Column Layout */}
                <div className="grid grid-cols-12 gap-4 h-[calc(100vh-140px)]">
                    {/* Left Column - Form Info */}
                    <div className="col-span-12 sm:col-span-3 lg:col-span-2">
                        <Card className="border border-neutral-200 bg-white rounded-xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md transition-all">
                            <CardHeader className="bg-neutral-50 text-neutral-900 p-4 border-b border-neutral-200">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 text-neutral-900">
                                    <FaFileAlt className="h-4 w-4 text-blue-500" />
                                    Form Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3 overflow-y-auto flex-1">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">By</p>
                                    <p className="text-sm font-medium text-neutral-900">{username}</p>
                                </div>
                                <div className="border-t border-neutral-200"></div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Status</p>
                                    <p className="text-sm font-medium text-neutral-900">{valuation?.status?.charAt(0).toUpperCase() + valuation?.status?.slice(1)}</p>
                                </div>
                                <div className="border-t border-neutral-200"></div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Last Updated</p>
                                    <p className="text-sm font-medium text-neutral-900 break-words">{new Date().toLocaleString()}</p>
                                </div>
                                <div className="border-t border-neutral-200"></div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">ID</p>
                                    <code className="bg-neutral-100 px-2 py-1.5 rounded-lg text-xs font-mono break-all text-neutral-700 border border-neutral-300 block">{id.slice(0, 12)}...</code>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Main Form */}
                    <div className="col-span-12 sm:col-span-9 lg:col-span-10">
                        <Card className="border border-neutral-200 bg-white rounded-xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md transition-all">
                            <CardHeader className="bg-neutral-50 text-neutral-900 p-4 border-b border-neutral-200">
                                <CardTitle className="text-sm font-bold text-neutral-900">UBI APF Form Details</CardTitle>
                                <p className="text-neutral-600 text-xs mt-1.5 font-medium">* Required fields</p>
                            </CardHeader>
                            <CardContent className="p-4 overflow-y-auto flex-1">
                                <form className="space-y-3" onSubmit={onFinish}>

                                    {/* Main Tab Navigation - Client/Documents/Valuation */}
                                    <div className="flex gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-200 mb-6 overflow-x-auto">
                                        {[
                                            { id: 'client', label: 'CLIENT', icon: FaUser },
                                            { id: 'documents', label: 'DOCS', icon: FaFileAlt },
                                            { id: 'valuation', label: 'VALUATION', icon: FaBuilding }
                                        ].map(tab => (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`px-3 py-2 rounded-lg font-semibold text-xs whitespace-nowrap flex-shrink-0 transition-all flex items-center gap-1.5 ${activeTab === tab.id
                                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                                                    : "bg-white border border-gray-300 text-gray-900 hover:border-blue-500"
                                                    }`}
                                            >
                                                <tab.icon size={12} />
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Client Info Tab */}
                                    {activeTab === 'client' && (
                                        <div>
                                            <ClientInfoPanel
                                                formData={formData}
                                                bankName={bankName}
                                                city={city}
                                                canEdit={canEdit}
                                                canEditField={canEditField}
                                                handleInputChange={handleInputChange}
                                                handleIntegerInputChange={handleIntegerInputChange}
                                                handleLettersOnlyInputChange={handleLettersOnlyInputChange}
                                                setBankName={setBankName}
                                                setCity={setCity}
                                                setFormData={setFormData}
                                                banks={banks}
                                                cities={cities}
                                                dsaNames={dsaNames}
                                                dsa={dsa}
                                                setDsa={setDsa}
                                            />
                                        </div>
                                    )}

                                    {/* Documents Tab */}
                                    {activeTab === 'documents' && (
                                        <div>
                                            <DocumentsPanel
                                                formData={formData}
                                                canEdit={canEdit}
                                                locationImagePreviews={locationImagePreviews}
                                                imagePreviews={imagePreviews}
                                                handleLocationImageUpload={handleLocationImageUpload}
                                                handleImageUpload={handleImageUpload}
                                                removeLocationImage={removeLocationImage}
                                                removeImage={removeImage}
                                                handleInputChange={handleInputChange}
                                                handleCoordinateChange={handleCoordinateChange}
                                                setFormData={setFormData}
                                                locationFileInputRef={locationFileInputRef}
                                                fileInputRef1={fileInputRef1}
                                                fileInputRef2={fileInputRef2}
                                                fileInputRef3={fileInputRef3}
                                                fileInputRef4={fileInputRef4}
                                            />
                                        </div>
                                    )}

                                    {/* Valuation Tab */}
                                    {activeTab === 'valuation' && (
                                        <div>
                                            {/* Sub-tab Navigation */}
                                            <div className="flex gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-200 mb-6 overflow-x-auto">
                                                {[
                                                    { id: 'general', label: 'GENERAL' },
                                                    { id: 'valuation', label: 'VALUATION' },
                                                    { id: 'market', label: 'MARKET' }
                                                ].map(tab => (
                                                    <button
                                                        key={tab.id}
                                                        type="button"
                                                        onClick={() => setActiveValuationSubTab(tab.id)}
                                                        className={`px-3 py-2 rounded-lg font-semibold text-xs whitespace-nowrap flex-shrink-0 transition-all ${activeValuationSubTab === tab.id
                                                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                                                            : "bg-white border border-gray-300 text-gray-900 hover:border-blue-500"
                                                            }`}
                                                    >
                                                        {tab.label}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Sub-tab Content */}
                                            <div className="space-y-6">
                                                {activeValuationSubTab === 'general' && renderGeneralTab()}
                                                {activeValuationSubTab === 'valuation' && renderValuationTab()}
                                                {activeValuationSubTab === 'market' && renderMarketAnalysisTab()}
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Buttons */}
                                    <div className="flex gap-2 pt-3 border-t border-neutral-200">
                                        <Button
                                            type="button"
                                            onClick={handleDownloadPDF}
                                            disabled={loading}
                                            className="flex-1 h-9 text-xs font-bold rounded-lg bg-green-500 hover:bg-green-600 text-white transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-1.5 whitespace-nowrap"
                                        >
                                            <FaDownload size={12} />
                                            PDF
                                        </Button>
                                        {canEdit && (
                                            <>
                                                <Button
                                                    type="button"
                                                    onClick={onFinish}
                                                    disabled={loading}
                                                    className="flex-1 h-9 text-xs font-bold rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-md hover:shadow-lg disabled:opacity-60 whitespace-nowrap"
                                                >
                                                    {loading ? "Saving..." : "Save"}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        if (valuation) {
                                                            navigateToEditForm(valuation);
                                                        } else {
                                                            navigate("/dashboard");
                                                        }
                                                    }}
                                                    disabled={loading}
                                                    className="flex-1 h-9 text-xs font-bold rounded-lg border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 text-neutral-900 transition-all whitespace-nowrap"
                                                >
                                                    Back
                                                </Button>
                                            </>
                                        )}

                                        {canApprove && (
                                            <>
                                                <Button
                                                    type="button"
                                                    onClick={() => handleManagerAction("approve")}
                                                    disabled={loading}
                                                    className="flex-1 h-9 text-xs font-bold rounded-lg bg-green-500 hover:bg-green-600 text-white transition-all shadow-md hover:shadow-lg disabled:opacity-60 whitespace-nowrap"
                                                >
                                                    {loading ? "Processing..." : "Approve"}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={() => handleManagerAction("reject")}
                                                    disabled={loading}
                                                    className="flex-1 h-9 text-xs font-bold rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all shadow-md hover:shadow-lg disabled:opacity-60 whitespace-nowrap"
                                                >
                                                    {loading ? "Processing..." : "Reject"}
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Approval/Rejection Dialog */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {modalAction === "approve" ? "Approve Form" : "Reject Form"}
                        </DialogTitle>
                        <DialogDescription>
                            {modalAction === "approve" ? "Enter approval notes (optional)" : "Please provide feedback for rejection"}
                        </DialogDescription>
                    </DialogHeader>

                    <Textarea
                        placeholder={modalAction === "approve" ? "Enter approval notes (optional)" : "Please provide feedback for rejection"}
                        value={modalFeedback}
                        onChange={(e) => setModalFeedback(e.target.value)}
                        rows={4}
                        autoFocus
                    />

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setModalOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant={modalAction === "approve" ? "default" : "destructive"}
                            onClick={handleModalOk}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : (modalAction === "approve" ? "Approve" : "Reject")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UbiApfEditForm;
