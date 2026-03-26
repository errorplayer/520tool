// app/api/stats/use/route.js
import { supabase } from '@/lib/supabase';

export async function POST(request) {
    try {
        const { tool_id } = await request.json();

        if (!tool_id) {
            return Response.json({ error: '缺少 tool_id' }, { status: 400 });
        }

        const { error } = await supabase.rpc('increment_use_count', { p_tool_id: tool_id });

        if (error) {
            console.error('统计失败:', error);
            return Response.json({ error: '统计失败' }, { status: 500 });
        }

        return Response.json({ success: true });
    } catch (err) {
        console.error('请求异常:', err);
        return Response.json({ error: '请求异常' }, { status: 500 });
    }
}
