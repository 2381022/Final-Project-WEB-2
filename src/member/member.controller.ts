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
import { MemberService } from './member.service';
import { CreateMemberDto, UpdateMemberDto, MemberResponseDto } from './dto';
import { AuthGuard } from '../auth/auth.guard'; // Adjust path as needed
import { Member } from './member.entity';

@ApiTags('Member')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('member')
export class MemberController {
    constructor(private readonly memberService: MemberService) { }

    // Note: Member creation might be handled by a public registration endpoint
    // Depending on requirements, this might not need AuthGuard or could be admin-only
    @Post()
    @ApiOperation({ summary: 'Create a new member (Admin operation)' })
    @ApiResponse({ status: 201, description: 'Member created successfully.', type: MemberResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 409, description: 'Conflict (e.g., username exists)' })
    async create(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
        return this.memberService.create(createMemberDto);
         // Map to MemberResponseDto if needed
    }

    @Get()
    @ApiOperation({ summary: 'Get all members' })
    @ApiResponse({ status: 200, description: 'List of members.', type: [MemberResponseDto] })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async findAll(): Promise<Member[]> {
        return this.memberService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a member by ID' })
    @ApiResponse({ status: 200, description: 'Member details.', type: MemberResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Member not found.' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Member> {
        return this.memberService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a member by ID' })
    @ApiResponse({ status: 200, description: 'Member updated successfully.', type: MemberResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Member not found.' })
     @ApiResponse({ status: 409, description: 'Conflict (e.g., username exists)' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateMemberDto: UpdateMemberDto,
    ): Promise<Member> {
        return this.memberService.update(id, updateMemberDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a member by ID' })
    @ApiResponse({ status: 204, description: 'Member deleted successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Member not found.' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.memberService.remove(id);
    }
}