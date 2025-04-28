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
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto, AdminResponseDto } from './dto'; // Using barrel file
import { AuthGuard } from '../auth/auth.guard'; // Adjust path as needed
import { Admin } from './admin.entity';

@ApiTags('Admin')
@ApiBearerAuth() // Indicates that endpoints below need Bearer token auth
@UseGuards(AuthGuard) // Apply guard to the whole controller
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new admin' })
    @ApiResponse({ status: 201, description: 'Admin created successfully.', type: AdminResponseDto }) // Use Response DTO if shaping needed
    @ApiResponse({ status: 400, description: 'Bad Request (validation failed, etc.)' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 409, description: 'Conflict (e.g., username exists)' })
    async create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> { // Return type could be AdminResponseDto
        const admin = await this.adminService.create(createAdminDto);
        // Map to AdminResponseDto if needed to exclude password explicitly in response
        // return new AdminResponseDto({ id: admin.id, username: admin.username });
        return admin; // Service/Entity handles password exclusion on reads
    }

    @Get()
    @ApiOperation({ summary: 'Get all admins' })
    @ApiResponse({ status: 200, description: 'List of admins.', type: [AdminResponseDto] })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async findAll(): Promise<Admin[]> {
        return this.adminService.findAll();
        // Map to AdminResponseDto if needed
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an admin by ID' })
    @ApiResponse({ status: 200, description: 'Admin details.', type: AdminResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Admin not found.' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Admin> {
        return this.adminService.findOne(id);
         // Map to AdminResponseDto if needed
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an admin by ID' })
    @ApiResponse({ status: 200, description: 'Admin updated successfully.', type: AdminResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Admin not found.' })
    @ApiResponse({ status: 409, description: 'Conflict (e.g., username exists)' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAdminDto: UpdateAdminDto,
    ): Promise<Admin> {
        return this.adminService.update(id, updateAdminDto);
         // Map to AdminResponseDto if needed
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an admin by ID' })
    @ApiResponse({ status: 204, description: 'Admin deleted successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Admin not found.' })
    @HttpCode(HttpStatus.NO_CONTENT) // Set HTTP status to 204
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.adminService.remove(id);
    }
}