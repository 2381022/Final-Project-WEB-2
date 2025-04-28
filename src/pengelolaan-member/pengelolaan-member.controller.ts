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
    Query, // Import Query decorator
    HttpStatus,
    HttpCode,
    Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PengelolaanMemberService } from './pengelolaan-member.service';
import { CreatePengelolaanMemberDto, UpdatePengelolaanMemberDto, PengelolaanMemberResponseDto } from './dto';
import { AuthGuard } from '../auth/auth.guard'; // Adjust path
import { PengelolaanMember } from './PengelolaanMember.entity';
import { Request } from 'express';

// Extend Request type if needed for user property
interface RequestWithUser extends Request {
    user: { sub: number; username: string; /* other payload props */ };
}

@ApiTags('Pengelolaan Member (Member Management/Assignment)')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('pengelolaan-member')
export class PengelolaanMemberController {
    constructor(private readonly pmService: PengelolaanMemberService) { }

    @Post()
    @ApiOperation({ summary: 'Assign/Manage a member for a schedule (Admin)' })
    @ApiResponse({ status: 201, description: 'Record created successfully.', type: PengelolaanMemberResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request (validation, member already assigned, etc.)' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Schedule, Member, or Admin not found.' })
    async create(
        @Body() createDto: CreatePengelolaanMemberDto,
         // @Req() req: RequestWithUser, // Use Req to get logged-in user if needed server-side
        ): Promise<PengelolaanMember> {

         // Ideal Scenario: Get adminId from token instead of DTO
         // const adminId = req.user.sub;
         // const dtoWithAdmin = { ...createDto, adminId: adminId }
         // return this.pmService.create(dtoWithAdmin); // Adjust service if needed

        // Current implementation relies on adminId being present in DTO
        return this.pmService.create(createDto);
         // Map to Response DTO if needed
    }

    @Get()
    @ApiOperation({ summary: 'Get all member management records (can filter by schedule or member)' })
    @ApiQuery({ name: 'jadwalId', required: false, type: Number, description: 'Filter by schedule ID' })
    @ApiQuery({ name: 'memberId', required: false, type: Number, description: 'Filter by member ID' })
    @ApiResponse({ status: 200, description: 'List of records.', type: [PengelolaanMemberResponseDto] })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async findAll(
        @Query('jadwalId', new ParseIntPipe({ optional: true })) jadwalId?: number,
        @Query('memberId', new ParseIntPipe({ optional: true })) memberId?: number,
    ): Promise<PengelolaanMember[]> {
        const filters = { jadwalId, memberId };
        // Remove undefined keys before passing to service
        Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
        return this.pmService.findAll(filters);
         // Map to Response DTO if needed
    }

    // Specific find by composite key
    @Get(':jadwalId/:memberId')
    @ApiOperation({ summary: 'Get a specific member management record by composite key' })
    @ApiResponse({ status: 200, description: 'Record details.', type: PengelolaanMemberResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Record not found.' })
    async findOne(
        @Param('jadwalId', ParseIntPipe) jadwalId: number,
        @Param('memberId', ParseIntPipe) memberId: number,
    ): Promise<PengelolaanMember> {
        return this.pmService.findOne(jadwalId, memberId);
         // Map to Response DTO if needed
    }

    @Patch(':jadwalId/:memberId')
    @ApiOperation({ summary: 'Update the status of a member management record' })
    @ApiResponse({ status: 200, description: 'Record updated successfully.', type: PengelolaanMemberResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Record not found.' })
    async update(
        @Param('jadwalId', ParseIntPipe) jadwalId: number,
        @Param('memberId', ParseIntPipe) memberId: number,
        @Body() updateDto: UpdatePengelolaanMemberDto,
    ): Promise<PengelolaanMember> {
        return this.pmService.update(jadwalId, memberId, updateDto);
        // Map to Response DTO if needed
    }

    @Delete(':jadwalId/:memberId')
    @ApiOperation({ summary: 'Remove a member management record by composite key' })
    @ApiResponse({ status: 204, description: 'Record deleted successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Record not found.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
        @Param('jadwalId', ParseIntPipe) jadwalId: number,
        @Param('memberId', ParseIntPipe) memberId: number,
    ): Promise<void> {
        await this.pmService.remove(jadwalId, memberId);
    }
}