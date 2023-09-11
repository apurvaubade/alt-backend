import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import jwt_decode from "jwt-decode";
import { SuccessResponse } from "src/success-response";
import { ErrorResponse } from "src/error-response";
import { SchoolDto } from "src/school/dto/school.dto";
import { SchoolSearchDto } from "src/school/dto/school-search.dto";
import { IServicelocator } from "../schoolservicelocator";

export const HasuraSchoolToken = "HasuraSchool";
@Injectable()
export class SchoolHasuraService implements IServicelocator {
  axios = require("axios");

  constructor(private httpService: HttpService) {}

  public async createSchool(request: any, schoolDto: SchoolDto) {
    const decoded: any = jwt_decode(request.headers.authorization);
    const altUserRoles =
      decoded["https://hasura.io/jwt/claims"]["x-hasura-allowed-roles"];

    const schoolSchema = new SchoolDto(schoolDto);
    let query = "";
    console.log(schoolSchema, "abscd");
    Object.keys(schoolSchema).forEach((e) => {
      if (
        // schoolSchema[e] &&
        // schoolSchema[e] != "" &&
        Object.keys(schoolSchema).includes(e)
      ) {
        console.log(e)
        if (e === "management" || e === "libraryFunctional") {
          query += `${e}: ${schoolSchema[e]},`;
        }
        else if (Array.isArray(schoolSchema[e])) {
          query += `${e}: ${JSON.stringify(schoolSchema[e])}, `;
        } else {
          query += `${e}: "${schoolSchema[e]}", `;
        }
      }
    });
    console.log(query);
  
    var data = {
      query: `mutation CreateSchool {
        insert_School_one(object: {${query}}) {
        udiseCode
         
        }
      }
      `,
      variables: {},
    };

    const headers = {
      Authorization: request.headers.authorization,
      "x-hasura-role": altUserRoles.includes("system-admin")
        ? "system-admin"
        : "user",
      "Content-Type": "application/json",
    };

    const config = {
      method: "post",
      url: process.env.REGISTRYHASURA,
      headers: headers,
      data: data,
    };

    const response = await this.axios(config);
    console.log(query);
    if (response?.data?.errors) {
      return new ErrorResponse({
        errorCode: response.data.errors[0].extensions,
        errorMessage: response.data.errors[0].message,
      });
    }
    console.log(query);
    const result = response.data.data.insert_School_one;

    return new SuccessResponse({
      statusCode: 200,
      message: "Ok.",
      data: result,
    });
  }

  public async updateSchool(id: string, request: any, schoolDto: SchoolDto) {
    var axios = require("axios");
    const schoolSchema = new SchoolDto(schoolDto);
    let query = "";
    Object.keys(schoolDto).forEach((e) => {
      if (
        schoolDto[e] &&
        schoolDto[e] != "" &&
        Object.keys(schoolSchema).includes(e)
      ) {
        if (Array.isArray(schoolDto[e])) {
          query += `${e}: ${JSON.stringify(schoolDto[e])}, `;
        } else {
          query += `${e}: "${schoolDto[e]}", `;
        }
      }
    });

    var data = {
      query: `mutation UpdateSchool($schoolId:uuid) {
          update_School(where: {schoolId: {_eq: $schoolId}}, _set: {${query}}) {
          affected_rows
        }}`,
      variables: {
        schoolId: id,
      },
    };

    var config = {
      method: "post",
      url: process.env.REGISTRYHASURA,
      headers: {
        Authorization: request.headers.authorization,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios(config);

    if (response?.data?.errors) {
      return new ErrorResponse({
        errorCode: response.data.errors[0].extensions,
        errorMessage: response.data.errors[0].message,
      });
    }

    const result = response.data.data.update_School;

    return new SuccessResponse({
      statusCode: 200,
      message: "Ok.",
      data: result,
    });
  }

  public async getSchool(schoolId: any, request: any) {
    var axios = require("axios");

 
    //   query: `query GetSchool($schoolId:uuid!) {
    //     School_by_pk(schoolId: $schoolId) {
    //         address
    //         block
    //         created_at
    //         deactivationReason
    //         district
    //         email
    //         latitude
    //         enrollCount
    //         locationId
    //         longitude
    //         mediumOfInstruction
    //         metaData
    //         phoneNumber
    //         updated_at
    //         status
    //         udise
    //         stateId
    //         schoolType
    //         schoolName
    //         schoolId
    //         pincode
    //         village
    //         website
    //         cluster
    //         headMaster
    //         board
    //     }
    //   }
    //   `,
    //   variables: { schoolId: schoolId },
    // };

    const data = {
      query: `query GetSchool($schoolId:String!) {
        School_by_pk(udiseCode: $schoolId) {
            name
            udiseCode                                             
            id
            location
            management
            composition
            board
            mediumOfInstruction
            headmaster
            headmasterMobile
            upperPrimaryTeachersSanctioned
            secondaryTeachersSanctioned
            libraryFunctional
            computerLabFunctional
            totalFunctionalComputers
            noOfBoysToilet
            noOfGirlsToilet
            smrtBrd6Functional
            smrtBrd7Functional
            smrtBrd8Functional
            smrtBrd9Functional
            smrtBrd10Functional
            state
            district
            block
            createdAt
            updatedAt
            adequateRoomsForEveryClass
            drinkingWaterSupply
            seperateToiletForGirlsAndBoys
            whetherToiletBeingUsed
            playgroundAvailable
            boundaryWallFence
            electricFittingsAreInsulated
            buildingIsResistantToEarthquakeFireFloodOtherCalamity
            buildingIsFreeFromInflammableAndToxicMaterials
            roofAndWallsAreInGoodCondition
        }
      }
      `,
      variables: { schoolId: schoolId },
    };

    const config = {
      method: "post",
      url: process.env.REGISTRYHASURA,
      headers: {
        Authorization: request.headers.authorization,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios(config);

    if (response?.data?.errors) {
      return new ErrorResponse({
        errorCode: response.data.errors[0].extensions,
        errorMessage: response.data.errors[0].message,
      });
    }
    console.log(response.data.data);
    let result = [response.data.data.School_by_pk];
    const schoolDto = await this.mappedResponse(result);
    return new SuccessResponse({
      statusCode: 200,
      message: "Ok.",
      data: schoolDto[0],
    });
  }

  public async searchSchool(request: any, schoolSearchDto: SchoolSearchDto) {
    var axios = require("axios");

    let offset = 0;

    if (schoolSearchDto.page > 1) {
      offset = parseInt(schoolSearchDto.limit) * (schoolSearchDto.page - 1);
    }

    let query = "";
    Object.keys(schoolSearchDto.filters).forEach((e) => {
      if (schoolSearchDto.filters[e] && schoolSearchDto.filters[e] != "") {
        if (e === "schoolName") {
          query += `${e}:{_ilike: "%${schoolSearchDto.filters[e]}%"}`;
        } else {
          query += `${e}:{_eq:"${schoolSearchDto.filters[e]}"}`;
        }
      }
    });

    var data = {
      query: `query SearchSchool($limit:Int, $offset:Int) {
            School(where:{ ${query}}, limit: $limit, offset: $offset,) {
                address
                block
                created_at
                deactivationReason
                district
                email
                latitude
                enrollCount
                locationId
                longitude
                mediumOfInstruction
                metaData
                phoneNumber
                updated_at
                status
                udise
                stateId
                schoolType
                schoolName
                schoolId
                pincode
                village
                website
                cluster
                headMaster
                board
            }
          }`,
      variables: {
        limit: parseInt(schoolSearchDto.limit),
        offset: offset,
      },
    };
    var config = {
      method: "post",
      url: process.env.REGISTRYHASURA,
      headers: {
        Authorization: request.headers.authorization,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios(config);

    if (response?.data?.errors) {
      return new ErrorResponse({
        errorCode: response.data.errors[0].extensions,
        errorMessage: response.data.errors[0].message,
      });
    }

    let result = response.data.data.School;

    const schoolDto = await this.mappedResponse(result);

    return new SuccessResponse({
      statusCode: 200,
      message: "Ok.",
      data: schoolDto,
    });
  }

  public async mappedResponse(result: any) {
    const schoolResponse = result.map((item: any) => {
      console.log(item)

      const schoolMapping = {
        id: item?.id ? `${item.id}` : "",
        name: item?.name ? `${item.name}` : "",
        email: item?.email ? `${item.email}` : "",
        udiseCode: item?.udiseCode ? `${item.udiseCode}` : "",
        mediumOfInstruction: item?.mediumOfInstruction
          ? item.mediumOfInstruction
          : "",
        headMaster: item?.headmaster ? `${item.headmaster}` : "",
        board: item?.board ? `${item.board}` : "",
        block: item?.block ? `${item.block}` : "",
        district: item?.district ? `${item.district}` : "",
        state: item?.state ? `${item.state}` : "",
        location: item?.location ? `${item.location}` : "",
        createdAt: item?.created_at ? `${item.created_at}` : "",
        updatedAt: item?.updated_at ? `${item.updated_at}` : "",
        management: item?.management ? `${item.management}` : "",
        composition: item?.composition ? `${item.composition}` : "",
        headmasterMobile: item?.headmasterMobile
          ? `${item.headmasterMobile}`
          : "",
        upperPrimaryTeachersSanctioned: item?.upperPrimaryTeachersSanctioned
          ? `${item.upperPrimaryTeachersSanctioned}`
          : "",
        secondaryTeachersSanctioned: item?.secondaryTeachersSanctioned
          ? `${item.secondaryTeachersSanctioned}`
          : "",
        libraryFunctional: item?.libraryFunctional
          ? `${item.libraryFunctional}`
          : "",
        computerLabFunctional: item?.computerLabFunctional
          ? `${item.computerLabFunctional}`
          : "",
        totalFunctionalComputers: item?.totalFunctionalComputers
          ? `${item.totalFunctionalComputers}`
          : "",
        noOfBoysToilet: item?.noOfBoysToilet
          ? `${item.noOfBoysToilet}`
          : "",
        noOfGirlsToilet: item?.noOfGirlsToilet
          ? `${item.noOfGirlsToilet}`
          : "",
        smrtBrd6Functional: item?.smrtBrd6Functional
          ? `${item.smrtBrd6Functional}`
          : "",
        smrtBrd7Functional: item?.smrtBrd7Functional
          ? `${item.smrtBrd7Functional}`
          : "",
        smrtBrd8Functional: item?.smrtBrd8Functional
          ? `${item.smrtBrd8Functional}`
          : "",
        smrtBrd9Functional: item?.smrtBrd9Functional
          ? `${item.smrtBrd9Functional}`
          : "",
        smrtBrd10Functional: item?.smrtBrd10Functional
          ? `${item.smrtBrd10Functional}`
          : "",
        adequateRoomsForEveryClass: item?.adequateRoomsForEveryClass
          ? `${item.adequateRoomsForEveryClass}`
          : "",
        drinkingWaterSupply: item?.drinkingWaterSupply
          ? `${item.drinkingWaterSupply}`
          : "",
        seperateToiletForGirlsAndBoys: item?.seperateToiletForGirlsAndBoys
          ? `${item.seperateToiletForGirlsAndBoys}`
          : "",
        whetherToiletBeingUsed: item?.whetherToiletBeingUsed
          ? `${item.whetherToiletBeingUsed}`
          : "",
        playgroundAvailable: item?.playgroundAvailable
          ? `${item.playgroundAvailable}`
          : "",
        boundaryWallFence: item?.boundaryWallFence
          ? `${item.boundaryWallFence}`
          : "",
        electricFittingsAreInsulated: item?.electricFittingsAreInsulated
          ? `${item.electricFittingsAreInsulated}`
          : "",

        buildingIsResistantToEarthquakeFireFloodOtherCalamity:
          item?.buildingIsResistantToEarthquakeFireFloodOtherCalamity
            ? `${item.buildingIsResistantToEarthquakeFireFloodOtherCalamity}`
            : "",
        buildingIsFreeFromInflammableAndToxicMaterials:
          item?.buildingIsFreeFromInflammableAndToxicMaterials
            ? `${item.buildingIsFreeFromInflammableAndToxicMaterials}`
            : "",
        roofAndWallsAreInGoodCondition:
          item?.roofAndWallsAreInGoodCondition
            ? `${item.roofAndWallsAreInGoodCondition}`
            : "",
      };
      return new SchoolDto(schoolMapping);
    });

    return schoolResponse;
  }

  
}
