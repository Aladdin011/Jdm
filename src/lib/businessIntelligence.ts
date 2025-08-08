import { useAppStore } from '@/stores/appStore';
import { UserInteraction, LeadScoringData } from './personalization';

// Business Intelligence Metrics
export interface BusinessMetrics {
  revenue: {
    total: number;
    monthly: number;
    quarterly: number;
    annual: number;
    growth: number;
  };
  leads: {
    total: number;
    qualified: number;
    converted: number;
    conversionRate: number;
    averageValue: number;
  };
  marketing: {
    traffic: number;
    sources: Record<string, number>;
    campaigns: Record<string, CampaignMetrics>;
    roi: number;
    costPerLead: number;
  };
  projects: {
    active: number;
    completed: number;
    pipeline: number;
    averageSize: number;
    successRate: number;
  };
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  revenue: number;
  roi: number;
}

export interface LeadProfile {
  id: string;
  score: number;
  classification: 'cold' | 'warm' | 'hot' | 'qualified';
  source: string;
  firstTouch: Date;
  lastTouch: Date;
  touchpoints: string[];
  estimatedValue: number;
  probability: number;
  nextAction: string;
  assignedTo?: string;
  companySize?: 'startup' | 'sme' | 'enterprise';
  industry?: string;
  location?: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface AttributionModel {
  type: 'first-touch' | 'last-touch' | 'linear' | 'time-decay' | 'position-based';
  weights: Record<string, number>;
  revenue: number;
  touchpoints: Array<{
    channel: string;
    timestamp: Date;
    value: number;
    attribution: number;
  }>;
}

// Business Intelligence Engine
export class BusinessIntelligenceEngine {
  private leads: Map<string, LeadProfile> = new Map();
  private metrics: BusinessMetrics;
  private attributionModels: AttributionModel[] = [];
  
  constructor() {
    this.metrics = this.initializeMetrics();
    this.loadExistingData();
  }
  
  private initializeMetrics(): BusinessMetrics {
    return {
      revenue: {
        total: 0,
        monthly: 0,
        quarterly: 0,
        annual: 0,
        growth: 0,
      },
      leads: {
        total: 0,
        qualified: 0,
        converted: 0,
        conversionRate: 0,
        averageValue: 0,
      },
      marketing: {
        traffic: 0,
        sources: {},
        campaigns: {},
        roi: 0,
        costPerLead: 0,
      },
      projects: {
        active: 0,
        completed: 0,
        pipeline: 0,
        averageSize: 0,
        successRate: 0,
      },
    };
  }
  
  // Lead Scoring and Management
  createLead(interaction: UserInteraction, scoringData: LeadScoringData): LeadProfile {
    const leadId = this.generateLeadId();
    const estimatedValue = this.calculateEstimatedValue(scoringData);
    const probability = this.calculateConversionProbability(scoringData);
    
    const lead: LeadProfile = {
      id: leadId,
      score: scoringData.score,
      classification: scoringData.classification,
      source: this.determineLeadSource(interaction),
      firstTouch: new Date(),
      lastTouch: new Date(),
      touchpoints: [interaction.type],
      estimatedValue,
      probability,
      nextAction: this.determineNextAction(scoringData),
      urgency: this.determineUrgency(scoringData),
    };
    
    this.leads.set(leadId, lead);
    this.updateLeadMetrics();
    
    // Trigger high-value lead alert if necessary
    if (lead.score > 80 || lead.estimatedValue > 100000) {
      this.triggerHighValueLeadAlert(lead);
    }
    
    return lead;
  }
  
  updateLead(leadId: string, interaction: UserInteraction, scoringData: LeadScoringData): LeadProfile | null {
    const lead = this.leads.get(leadId);
    if (!lead) return null;
    
    lead.score = Math.max(lead.score, scoringData.score); // Take highest score
    lead.classification = scoringData.classification;
    lead.lastTouch = new Date();
    lead.touchpoints.push(interaction.type);
    lead.estimatedValue = this.calculateEstimatedValue(scoringData);
    lead.probability = this.calculateConversionProbability(scoringData);
    lead.nextAction = this.determineNextAction(scoringData);
    lead.urgency = this.determineUrgency(scoringData);
    
    this.updateLeadMetrics();
    return lead;
  }
  
  private generateLeadId(): string {
    return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private calculateEstimatedValue(scoringData: LeadScoringData): number {
    // Base value calculation based on lead characteristics
    let baseValue = 50000; // Average project value
    
    // Adjust based on score
    const scoreMultiplier = Math.min(scoringData.score / 50, 3);
    baseValue *= scoreMultiplier;
    
    // Adjust based on classification
    const classificationMultipliers = {
      'cold': 0.5,
      'warm': 1,
      'hot': 1.5,
      'qualified': 2,
    };
    
    baseValue *= classificationMultipliers[scoringData.classification];
    
    // Add randomness for realistic simulation
    const variance = 0.3; // 30% variance
    const multiplier = 1 + (Math.random() - 0.5) * variance;
    
    return Math.round(baseValue * multiplier);
  }
  
  private calculateConversionProbability(scoringData: LeadScoringData): number {
    const baseProb = {
      'cold': 0.05,
      'warm': 0.15,
      'hot': 0.35,
      'qualified': 0.65,
    }[scoringData.classification];
    
    // Adjust based on specific factors
    let probability = baseProb;
    
    if (scoringData.factors.contactFormInteraction > 20) probability += 0.1;
    if (scoringData.factors.portfolioEngagement > 15) probability += 0.05;
    if (scoringData.factors.returnVisitor) probability += 0.05;
    if (scoringData.factors.timeOnSite > 20) probability += 0.05;
    
    return Math.min(0.95, probability);
  }
  
  private determineLeadSource(interaction: UserInteraction): string {
    // Determine lead source from interaction data
    const referrer = document.referrer;
    const utm = new URLSearchParams(window.location.search);
    
    if (utm.get('utm_source')) {
      return `${utm.get('utm_source')}/${utm.get('utm_medium')}`;
    }
    
    if (referrer.includes('google')) return 'organic/google';
    if (referrer.includes('facebook')) return 'social/facebook';
    if (referrer.includes('linkedin')) return 'social/linkedin';
    if (referrer.includes('twitter')) return 'social/twitter';
    
    return referrer ? 'referral' : 'direct';
  }
  
  private determineNextAction(scoringData: LeadScoringData): string {
    switch (scoringData.classification) {
      case 'qualified':
        return 'Schedule sales call within 24 hours';
      case 'hot':
        return 'Send personalized proposal within 48 hours';
      case 'warm':
        return 'Follow up with relevant case studies';
      case 'cold':
        return 'Add to nurture email sequence';
      default:
        return 'Continue monitoring engagement';
    }
  }
  
  private determineUrgency(scoringData: LeadScoringData): LeadProfile['urgency'] {
    if (scoringData.score > 80) return 'high';
    if (scoringData.score > 60) return 'medium';
    return 'low';
  }
  
  private triggerHighValueLeadAlert(lead: LeadProfile): void {
    // In a real implementation, this would send notifications
    console.log('🚨 High-Value Lead Alert:', lead);
    
    // Could integrate with:
    // - Slack notifications
    // - Email alerts
    // - CRM webhooks
    // - Sales team notifications
    
    // Example notification payload
    const notification = {
      type: 'high_value_lead',
      lead: {
        id: lead.id,
        score: lead.score,
        estimatedValue: lead.estimatedValue,
        source: lead.source,
        urgency: lead.urgency,
      },
      timestamp: new Date(),
      action: 'immediate_follow_up_required',
    };
    
    // Send to notification service
    this.sendNotification(notification);
  }
  
  // Marketing Attribution
  trackTouchpoint(channel: string, value: number = 0): void {
    const touchpoint = {
      channel,
      timestamp: new Date(),
      value,
      attribution: 0, // Will be calculated later
    };
    
    // Add to attribution models
    this.attributionModels.forEach(model => {
      model.touchpoints.push(touchpoint);
      this.calculateAttribution(model);
    });
  }
  
  private calculateAttribution(model: AttributionModel): void {
    const touchpoints = model.touchpoints;
    const totalValue = model.revenue;
    
    switch (model.type) {
      case 'first-touch':
        this.calculateFirstTouchAttribution(touchpoints, totalValue);
        break;
      case 'last-touch':
        this.calculateLastTouchAttribution(touchpoints, totalValue);
        break;
      case 'linear':
        this.calculateLinearAttribution(touchpoints, totalValue);
        break;
      case 'time-decay':
        this.calculateTimeDecayAttribution(touchpoints, totalValue);
        break;
      case 'position-based':
        this.calculatePositionBasedAttribution(touchpoints, totalValue);
        break;
    }
  }
  
  private calculateFirstTouchAttribution(touchpoints: any[], totalValue: number): void {
    if (touchpoints.length > 0) {
      touchpoints[0].attribution = totalValue;
      touchpoints.slice(1).forEach(tp => tp.attribution = 0);
    }
  }
  
  private calculateLastTouchAttribution(touchpoints: any[], totalValue: number): void {
    if (touchpoints.length > 0) {
      touchpoints[touchpoints.length - 1].attribution = totalValue;
      touchpoints.slice(0, -1).forEach(tp => tp.attribution = 0);
    }
  }
  
  private calculateLinearAttribution(touchpoints: any[], totalValue: number): void {
    const attribution = totalValue / touchpoints.length;
    touchpoints.forEach(tp => tp.attribution = attribution);
  }
  
  private calculateTimeDecayAttribution(touchpoints: any[], totalValue: number): void {
    const now = Date.now();
    const weights = touchpoints.map(tp => {
      const daysAgo = (now - tp.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      return Math.pow(0.7, daysAgo); // 30% decay per day
    });
    
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    
    touchpoints.forEach((tp, index) => {
      tp.attribution = (weights[index] / totalWeight) * totalValue;
    });
  }
  
  private calculatePositionBasedAttribution(touchpoints: any[], totalValue: number): void {
    if (touchpoints.length === 1) {
      touchpoints[0].attribution = totalValue;
    } else if (touchpoints.length === 2) {
      touchpoints[0].attribution = totalValue * 0.5;
      touchpoints[1].attribution = totalValue * 0.5;
    } else {
      // 40% first touch, 20% last touch, 40% distributed among middle touches
      touchpoints[0].attribution = totalValue * 0.4;
      touchpoints[touchpoints.length - 1].attribution = totalValue * 0.2;
      
      const middleAttribution = totalValue * 0.4;
      const middleTouchpoints = touchpoints.slice(1, -1);
      const middleShare = middleAttribution / middleTouchpoints.length;
      
      middleTouchpoints.forEach(tp => tp.attribution = middleShare);
    }
  }
  
  // Revenue Tracking
  trackRevenue(amount: number, leadId?: string, source?: string): void {
    this.metrics.revenue.total += amount;
    this.metrics.revenue.monthly += amount; // Simplified - would need proper date handling
    
    if (leadId) {
      const lead = this.leads.get(leadId);
      if (lead) {
        lead.estimatedValue = amount; // Update with actual value
        this.metrics.leads.converted++;
      }
    }
    
    if (source) {
      // Update source performance
      this.updateSourcePerformance(source, amount);
    }
    
    this.calculateROI();
  }
  
  private updateSourcePerformance(source: string, revenue: number): void {
    const campaigns = this.metrics.marketing.campaigns;
    if (!campaigns[source]) {
      campaigns[source] = {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        cost: 0,
        revenue: 0,
        roi: 0,
      };
    }
    
    campaigns[source].revenue += revenue;
    campaigns[source].conversions++;
    campaigns[source].roi = campaigns[source].revenue / Math.max(campaigns[source].cost, 1);
  }
  
  private calculateROI(): void {
    const totalRevenue = this.metrics.revenue.total;
    const totalCost = Object.values(this.metrics.marketing.campaigns)
      .reduce((sum, campaign) => sum + campaign.cost, 0);
    
    this.metrics.marketing.roi = totalRevenue / Math.max(totalCost, 1);
  }
  
  // Analytics and Reporting
  generateLeadReport(): {
    summary: any;
    topSources: any[];
    conversionFunnel: any;
    recommendations: string[];
  } {
    const leads = Array.from(this.leads.values());
    
    const summary = {
      total: leads.length,
      qualified: leads.filter(l => l.classification === 'qualified').length,
      hot: leads.filter(l => l.classification === 'hot').length,
      warm: leads.filter(l => l.classification === 'warm').length,
      cold: leads.filter(l => l.classification === 'cold').length,
      averageScore: leads.reduce((sum, l) => sum + l.score, 0) / leads.length,
      totalValue: leads.reduce((sum, l) => sum + l.estimatedValue, 0),
    };
    
    const sourceGroups = leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topSources = Object.entries(sourceGroups)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }));
    
    const conversionFunnel = this.calculateConversionFunnel(leads);
    const recommendations = this.generateRecommendations(summary, topSources);
    
    return { summary, topSources, conversionFunnel, recommendations };
  }
  
  private calculateConversionFunnel(leads: LeadProfile[]): any {
    const stages = {
      visitors: leads.length,
      engaged: leads.filter(l => l.score > 30).length,
      interested: leads.filter(l => l.score > 50).length,
      qualified: leads.filter(l => l.classification === 'qualified').length,
      converted: leads.filter(l => l.classification === 'qualified' && Math.random() > 0.7).length, // Simulated
    };
    
    return {
      stages,
      conversionRates: {
        'visitor_to_engaged': stages.engaged / stages.visitors,
        'engaged_to_interested': stages.interested / stages.engaged,
        'interested_to_qualified': stages.qualified / stages.interested,
        'qualified_to_converted': stages.converted / stages.qualified,
      }
    };
  }
  
  private generateRecommendations(summary: any, topSources: any[]): string[] {
    const recommendations: string[] = [];
    
    if (summary.averageScore < 40) {
      recommendations.push('Lead quality is below average. Review targeting and qualification criteria.');
    }
    
    if (topSources[0] && topSources[0].count > summary.total * 0.6) {
      recommendations.push(`Over-dependence on ${topSources[0].source}. Diversify lead sources.`);
    }
    
    if (summary.qualified / summary.total < 0.1) {
      recommendations.push('Low qualification rate. Improve lead nurturing and scoring criteria.');
    }
    
    if (summary.hot + summary.qualified < summary.total * 0.2) {
      recommendations.push('Few high-intent leads. Enhance content marketing and retargeting.');
    }
    
    return recommendations;
  }
  
  // Real-time Dashboard Data
  getDashboardData(): {
    metrics: BusinessMetrics;
    recentLeads: LeadProfile[];
    alerts: any[];
    performance: any;
  } {
    const recentLeads = Array.from(this.leads.values())
      .sort((a, b) => b.lastTouch.getTime() - a.lastTouch.getTime())
      .slice(0, 10);
    
    const alerts = this.generateAlerts();
    const performance = this.calculatePerformance();
    
    return {
      metrics: this.metrics,
      recentLeads,
      alerts,
      performance,
    };
  }
  
  private generateAlerts(): any[] {
    const alerts: any[] = [];
    const leads = Array.from(this.leads.values());
    
    // High-value leads requiring attention
    const highValueLeads = leads.filter(l => l.score > 80 && l.urgency === 'high');
    if (highValueLeads.length > 0) {
      alerts.push({
        type: 'high_value_leads',
        count: highValueLeads.length,
        message: `${highValueLeads.length} high-value leads require immediate attention`,
        priority: 'high',
      });
    }
    
    // Stale leads
    const staleLeads = leads.filter(l => {
      const daysSinceLastTouch = (Date.now() - l.lastTouch.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceLastTouch > 7 && l.classification !== 'cold';
    });
    
    if (staleLeads.length > 0) {
      alerts.push({
        type: 'stale_leads',
        count: staleLeads.length,
        message: `${staleLeads.length} warm/hot leads haven't been contacted in over 7 days`,
        priority: 'medium',
      });
    }
    
    return alerts;
  }
  
  private calculatePerformance(): any {
    const leads = Array.from(this.leads.values());
    const thisMonth = leads.filter(l => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return l.firstTouch > monthAgo;
    });
    
    const lastMonth = leads.filter(l => {
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return l.firstTouch > twoMonthsAgo && l.firstTouch <= monthAgo;
    });
    
    return {
      leadGrowth: ((thisMonth.length - lastMonth.length) / Math.max(lastMonth.length, 1)) * 100,
      qualificationRate: thisMonth.filter(l => l.classification === 'qualified').length / thisMonth.length,
      averageScore: thisMonth.reduce((sum, l) => sum + l.score, 0) / thisMonth.length,
      pipelineValue: thisMonth.reduce((sum, l) => sum + l.estimatedValue, 0),
    };
  }
  
  // Data persistence
  private loadExistingData(): void {
    // In a real implementation, load from database or API
    const savedData = localStorage.getItem('jdmarc_bi_data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        this.metrics = data.metrics || this.metrics;
        // Reconstruct leads map
        if (data.leads) {
          Object.entries(data.leads).forEach(([id, lead]) => {
            this.leads.set(id, lead as LeadProfile);
          });
        }
      } catch (error) {
        console.warn('Failed to load BI data:', error);
      }
    }
  }
  
  saveData(): void {
    const data = {
      metrics: this.metrics,
      leads: Object.fromEntries(this.leads),
      timestamp: new Date(),
    };
    
    localStorage.setItem('jdmarc_bi_data', JSON.stringify(data));
  }
  
  private sendNotification(notification: any): void {
    // Integration point for external notification services
    console.log('Notification sent:', notification);
  }
  
  private updateLeadMetrics(): void {
    const leads = Array.from(this.leads.values());
    this.metrics.leads.total = leads.length;
    this.metrics.leads.qualified = leads.filter(l => l.classification === 'qualified').length;
    this.metrics.leads.conversionRate = this.metrics.leads.converted / this.metrics.leads.total;
    this.metrics.leads.averageValue = leads.reduce((sum, l) => sum + l.estimatedValue, 0) / leads.length;
  }
}

// Singleton instance
export const businessIntelligence = new BusinessIntelligenceEngine();

// React hook for easy usage
export const useBusinessIntelligence = () => {
  return {
    createLead: businessIntelligence.createLead.bind(businessIntelligence),
    updateLead: businessIntelligence.updateLead.bind(businessIntelligence),
    trackRevenue: businessIntelligence.trackRevenue.bind(businessIntelligence),
    trackTouchpoint: businessIntelligence.trackTouchpoint.bind(businessIntelligence),
    generateLeadReport: businessIntelligence.generateLeadReport.bind(businessIntelligence),
    getDashboardData: businessIntelligence.getDashboardData.bind(businessIntelligence),
    saveData: businessIntelligence.saveData.bind(businessIntelligence),
  };
};

// Auto-save data periodically
setInterval(() => {
  businessIntelligence.saveData();
}, 5 * 60 * 1000); // Every 5 minutes
