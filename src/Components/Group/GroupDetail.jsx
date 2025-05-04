import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import GroupPage from "./GroupPage";
import { api } from "../../config/api";

const GroupDetail = () => {
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/groups/${id}`);
                setGroup(response.data);
            } catch (err) {
                setError("Không thể tải dữ liệu nhóm");
            } finally {
                setLoading(false);
            }
        };

        fetchGroupData();
    }, [id]);

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return group ? <GroupPage group={group} /> : <div>Không có dữ liệu nhóm</div>;
};

export default GroupDetail;
