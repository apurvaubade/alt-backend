import { CacheModule, Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ProgramService } from "../adapters/hasura/altProgram.adapter";
import { ALTProgramAssociationService } from "../adapters/hasura/altProgramAssociation.adapter";
import { ALTCurrentPhaseController } from "./altCurrentPhase.controller";
import { ALTCourseTrackingService } from "src/adapters/hasura/altCourseTracking.adapter";
import { ALTCurrentPhaseService } from "src/adapters/hasura/altCurrentPhase.adapter";
const ttl = process.env.TTL as never;

@Module({
  imports: [
    HttpModule,
    CacheModule.register({
      ttl: ttl,
    }),
  ],
  controllers: [ALTCurrentPhaseController],
  providers: [
    ProgramService,
    ALTProgramAssociationService,
    ALTCourseTrackingService,
    ALTCurrentPhaseService
  ],
})
export class ALTCurrentPhaseModule {}