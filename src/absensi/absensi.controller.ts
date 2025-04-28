import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    UseGuards,
    HttpStatus,
    HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AbsensiService } from './absensi.service';
import { CreateAbsensiDto, UpdateAbsensiDto, AbsensiResponseDto } from './dto';
import { AuthGuard } from '../auth/auth.guard'; // Adjust path
import { Absensi } from './Absensi.entity';

@ApiTags('Absensi (Attendance)')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('absensi')
export class AbsensiController {
    constructor(private readonly absensiService: AbsensiService) { }

    @Post()
    @ApiOperation({ summary: 'Record member attendance' })
    @ApiResponse({ status: 201, description: 'Attendance recorded successfully.', type: AbsensiResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Member not found.' })
    async create(@Body() createDto: CreateAbsensiDto): Promise<Absensi> {
        return this.absensiService.create(createDto);
         // Map to Response DTO if needed
    }

    @Get()
    @ApiOperation({ summary: 'Get all attendance records' })
    @ApiResponse({ status: 200, description: 'List of attendance records.', type: [AbsensiResponseDto] })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async findAll(): Promise<Absensi[]> {
        return this.absensiService.findAll();
        // Map to Response DTO if needed
    }

    @Get('/member/:memberId')
    @ApiOperation({ summary: 'Get attendance records for a specific member' })
    @ApiResponse({ status: 200, description: 'List of attendance records.', type: [AbsensiResponseDto] })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Member not found (implicitly).' })
    async findByMember(@Param('memberId', ParseIntPipe) memberId: number): Promise<Absensi[]> {
        return this.absensiService.findByMember(memberId);
         // Map to Response DTO if needed
    }


    @Get(':id')
    @ApiOperation({ summary: 'Get an attendance record by ID' })
    @ApiResponse({ status: 200, description: 'Attendance record details.', type: AbsensiResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Attendance record not found.' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Absensi> {
        return this.absensiService.findOne(id);
        // Map to Response DTO if needed
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an attendance record by ID' })
    @ApiResponse({ status: 200, description: 'Attendance record updated successfully.', type: AbsensiResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Attendance record or related Member not found.' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateAbsensiDto,
    ): Promise<Absensi> {
        return this.absensiService.update(id, updateDto);
        // Map to Response DTO if needed
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an attendance record by ID' })
    @ApiResponse({ status: 204, description: 'Attendance record deleted successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Attendance record not found.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.absensiService.remove(id);
    }
}