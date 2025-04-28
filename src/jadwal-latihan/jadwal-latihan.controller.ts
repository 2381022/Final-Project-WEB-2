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
    Req, // Import Req to access request object
    HttpStatus,
    HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JadwalLatihanService } from './jadwal-latihan.service';
import { CreateJadwalLatihanDto, UpdateJadwalLatihanDto, JadwalLatihanResponseDto } from './dto';
import { AuthGuard } from '../auth/auth.guard'; // Adjust path
import { Request } from 'express'; // Import Request type
import { JadwalLatihan } from './JadwalLatihan.entity';

// Extend Request type if needed for user property
interface RequestWithUser extends Request {
    user: { sub: number; username: string; /* other payload props */ };
}

@ApiTags('Jadwal Latihan (Training Schedules)')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('jadwal-latihan')
export class JadwalLatihanController {
    constructor(private readonly jadwalLatihanService: JadwalLatihanService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new training schedule (Admin)' })
    @ApiResponse({ status: 201, description: 'Schedule created successfully.', type: JadwalLatihanResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Admin not found.' })
    async create(
        @Body() createDto: CreateJadwalLatihanDto,
        // @Req() req: RequestWithUser, // Use Req to get logged-in user if needed server-side
    ): Promise<JadwalLatihan> {
         // Ideal Scenario: Get adminId from token instead of DTO
         // const adminId = req.user.sub; // Assuming 'sub' holds the admin ID in JWT payload
         // const dtoWithAdmin = { ...createDto, adminId: adminId } // Create new object for service
         // return this.jadwalLatihanService.create(dtoWithAdmin); // Adjust service if needed

        // Current implementation relies on adminId being present in DTO
        return this.jadwalLatihanService.create(createDto);
        // Map to Response DTO if needed
    }

    @Get()
    @ApiOperation({ summary: 'Get all training schedules' })
    @ApiResponse({ status: 200, description: 'List of schedules.', type: [JadwalLatihanResponseDto] })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async findAll(): Promise<JadwalLatihan[]> {
        return this.jadwalLatihanService.findAll();
        // Map to Response DTO if needed
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a training schedule by ID' })
    @ApiResponse({ status: 200, description: 'Schedule details.', type: JadwalLatihanResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Schedule not found.' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<JadwalLatihan> {
        return this.jadwalLatihanService.findOne(id);
        // Map to Response DTO if needed
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a training schedule by ID' })
    @ApiResponse({ status: 200, description: 'Schedule updated successfully.', type: JadwalLatihanResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Schedule or related Admin not found.' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateJadwalLatihanDto,
    ): Promise<JadwalLatihan> {
        return this.jadwalLatihanService.update(id, updateDto);
         // Map to Response DTO if needed
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a training schedule by ID' })
    @ApiResponse({ status: 204, description: 'Schedule deleted successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Schedule not found.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.jadwalLatihanService.remove(id);
    }
}