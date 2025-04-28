import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    UseGuards,
    Query, // Import Query decorator
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PerubahanPasswordService } from './perubahan-password.service';
import { PerubahanPasswordResponseDto } from './dto';
import { AuthGuard } from '../auth/auth.guard'; // Adjust path
import { PerubahanPassword } from './PerubahanPassword.entity';

// Potentially add Role Guard if only Admins can view logs
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';
// import { UserRole } from './dto'; // Or a shared Role enum

@ApiTags('Perubahan Password Log (Audit)')
@ApiBearerAuth()
@UseGuards(AuthGuard) // Apply basic auth guard
// @UseGuards(AuthGuard, RolesGuard) // Example if using Role guard
// @Roles(UserRole.ADMIN) // Example: Restrict to Admins
@Controller('perubahan-password-log')
export class PerubahanPasswordController {
    constructor(private readonly ppService: PerubahanPasswordService) { }

    @Get()
    @ApiOperation({ summary: 'Get all password change log entries (Admin access recommended)' })
    @ApiQuery({ name: 'adminId', required: false, type: Number, description: 'Filter by admin ID' })
    @ApiQuery({ name: 'memberId', required: false, type: Number, description: 'Filter by member ID' })
    @ApiResponse({ status: 200, description: 'List of log entries.', type: [PerubahanPasswordResponseDto] })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    // @ApiResponse({ status: 403, description: 'Forbidden' }) // If using role guard
    async findAll(
        @Query('adminId', new ParseIntPipe({ optional: true })) adminId?: number,
        @Query('memberId', new ParseIntPipe({ optional: true })) memberId?: number,
    ): Promise<PerubahanPassword[]> { // Return entity or map to Response DTO
        const filters = { adminId, memberId };
        Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
        return this.ppService.findAll(filters);
         // Map to Response DTO if needed
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific password change log entry by ID (Admin access recommended)' })
    @ApiResponse({ status: 200, description: 'Log entry details.', type: PerubahanPasswordResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    // @ApiResponse({ status: 403, description: 'Forbidden' }) // If using role guard
    @ApiResponse({ status: 404, description: 'Log entry not found.' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<PerubahanPassword> {
        return this.ppService.findOne(id);
        // Map to Response DTO if needed
    }

    // No POST, PATCH, DELETE endpoints exposed via API for a log table
}