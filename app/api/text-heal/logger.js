const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

async function logUsage({ ip, sceneId, inputText, outputText, provider, responseMs, tokensUsed }) {
  if (!supabase) {
    console.warn('Supabase not configured, skipping log');
    return;
  }

  try {
    const { error: dbError } = await supabase
      .from('text_heal_logs')
      .insert({
        ip,
        scene_id: sceneId,
        input_text: inputText,
        output_text: outputText,
        provider,
        input_chars: inputText ? inputText.length : 0,
        output_chars: outputText ? outputText.length : 0,
        response_ms: responseMs,
        tokens_used: tokensUsed,
      });

    if (dbError) {
      console.error('Failed to log usage:', dbError);
    }
  } catch (err) {
    console.error('Failed to log usage:', err);
  }
}

module.exports = { logUsage };
