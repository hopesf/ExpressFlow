import { ApiRobots, ApiServices } from "../models";


const getCounters = async () => {
  // services lengths
  const serviceLength = await ApiServices.countDocuments();
  const activeServiceLength = await ApiServices.countDocuments({ "instances.enabled": true });
  const deactiveServiceLength = await ApiServices.countDocuments({ "instances.enabled": false });

  // robots length
  const robotLength = await ApiRobots.countDocuments();
  const activeRobotLength = await ApiRobots.countDocuments({ status: "on" });
  const deactiveRobotLength = await ApiRobots.countDocuments({ status: "off" });

  return [
    { title: "Toplam Servis", count: serviceLength },
    { title: "Aktif Servisler", count: activeServiceLength },
    { title: "Devredışı Servisler", count: deactiveServiceLength },
    { title: "Toplam Robot", count: robotLength },
    { title: "Aktif Robot", count: activeRobotLength },
    { title: "Devredışı Robot", count: deactiveRobotLength },
  ];
};
export default getCounters;
