import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TelemedicineService } from './telemedicine.service';
import { CallSessionService } from './call-session.service';
import { RecordVitalsDto } from './dto/telemedicine.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('telemedicine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('telemedicine')
export class TelemedicineController {
  constructor(
    private readonly telemedicineService: TelemedicineService,
    private readonly callSessionService: CallSessionService,
  ) {}

  @Get('turn-credentials')
  @ApiOperation({ summary: 'Get TURN/STUN ICE servers for WebRTC' })
  getTurnCredentials() {
    return { iceServers: this.telemedicineService.getIceServers() };
  }

  @Post('sessions/:id/start')
  @ApiOperation({ summary: 'Mark call session as started' })
  startSession(@Param('id') id: string) {
    return this.callSessionService.startSession(id);
  }

  @Post('sessions/:id/end')
  @ApiOperation({ summary: 'Mark call session as ended' })
  endSession(@Param('id') id: string, @Body() body: { qualityStats?: any }) {
    return this.callSessionService.endSession(id, body.qualityStats);
  }

  @Post('sessions/:id/vitals')
  @ApiOperation({ summary: 'Record in-call vitals snapshot' })
  recordVitals(@Param('id') id: string, @Body() dto: RecordVitalsDto) {
    return this.callSessionService.recordVitals(id, dto);
  }
}
