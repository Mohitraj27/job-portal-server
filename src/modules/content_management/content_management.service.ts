
import content_managementModel from './content_management.model';
import { IContent_management } from './content_management.types';

export const content_managementService = {
  async createContent_management(data: IContent_management) {
    return await content_managementModel.create(data);
  },

  async getAllContent_managements(query: any) {
    return await content_managementModel.find(query);
  },

  async getSingleContent_management(id: string) {
    return await content_managementModel.findById(id);
  },

  async updateContent_management(id: string, data: Partial<IContent_management>) {
    return await content_managementModel.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteContent_management(id: string) {
    return await content_managementModel.findByIdAndDelete(id);
  },
  async getContent_managementByStatus() {
    const status = ['draft', 'published', 'unpublished', 'archived'];
    const result = await content_managementModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
    ]);

    const resultStatus = result.map(item => item.status);
    const missedStatus = status.filter(s => !resultStatus.includes(s));

    const [totalCount, totalViews] = await Promise.all([
      content_managementModel.countDocuments(),
      content_managementModel.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$views' },
          },
        },
      ]),
    ]);

    return [...result, ...missedStatus.map(s => ({ status: s, count: 0 })), { status: 'total', count: totalCount }, { status: 'totalViews', count: totalViews?.[0]?.totalViews || 0 }];
  },
  async getTopFiveContents() {
    return await content_managementModel.find().sort({ views: -1 }).limit(5);
  },
};
  