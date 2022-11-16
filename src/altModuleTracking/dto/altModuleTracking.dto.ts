import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ALTModuleTrackingDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: "UserId of the user",
  })
  userId: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: "ID of the respective enrolled course",
  })
  courseId: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: "ID of the module of course",
  })
  moduleId: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: Number,
    description: "Total number of Modules completed",
  })
  totalNumberOfLessonsCompleted: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: Number,
    description: "Total number of Modules",
  })
  totalNumberOfLessons: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: Number,
    description: "Score of the Module",
  })
  calculatedScore: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: "Status of module",
  })
  status: string;

  @ApiProperty({
    type: String,
    description: "Created by uuid",
  })
  @Expose()
  createdBy: string;

  @ApiProperty({
    type: String,
    description: "Updated by uuid",
  })
  @Expose()
  updatedBy: string;

  @Expose()
  created_at: string;

  @Expose()
  updated_at: string;

  constructor(obj: any) {
    Object.assign(this, obj);
  }
}
