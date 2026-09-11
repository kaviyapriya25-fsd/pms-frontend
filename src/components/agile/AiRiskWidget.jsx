import { useState, useEffect } from "react";
import { FaRobot, FaExclamationTriangle, FaCheckCircle, FaUserClock, FaChartLine } from "react-icons/fa";
import api from "../../services/api";
import "./AiRiskWidget.css";

function AiRiskWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAiAnalytics();
  }, []);

  const loadAiAnalytics = async () => {
    try {
      const res = await api.get("/analytics/risk-prediction");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="ai-widget-card loading">Calculating AI Delay & Risk Metrics...</div>;
  }

  if (!data) return null;

  return (
    <div className="ai-widget-card">
      
      {/* Header */}
      <div className="ai-widget-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="ai-icon-badge">
            <FaRobot />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", color: "#0f172a", fontWeight: "700" }}>
              AI Delay & Bottleneck Risk Predictor
            </h3>
            <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
              Automated velocity analysis & workload balancer
            </p>
          </div>
        </div>

        <div className="health-score-badge">
          <span className="health-val">{data.healthScore}%</span>
          <span className="health-lbl">System Health</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="ai-metrics-grid">
        <div className="metric-box warning">
          <FaExclamationTriangle className="m-icon" />
          <div>
            <h4>{data.overdueCount}</h4>
            <p>Overdue Tasks</p>
          </div>
        </div>

        <div className="metric-box alert">
          <FaUserClock className="m-icon" />
          <div>
            <h4>{data.nearDeadlineCount}</h4>
            <p>Due &lt; 72 hrs</p>
          </div>
        </div>

        <div className="metric-box success">
          <FaCheckCircle className="m-icon" />
          <div>
            <h4>{data.completedTasks} / {data.totalTasks}</h4>
            <p>Completed Tasks</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="ai-recommendations">
        <h5><FaChartLine style={{ color: "#2563eb" }} /> AI Strategic Recommendations:</h5>
        <ul>
          {data.aiRecommendations && data.aiRecommendations.map((rec, idx) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default AiRiskWidget;
