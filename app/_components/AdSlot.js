export default function AdSlot({ position = 'top' }) {
  return (
    <div className={position === 'top' ? 'ad-top' : 'ad-bottom'}>
      <p>【广告位】- {position === 'top' ? '顶部横幅广告' : '底部广告'}</p>
    </div>
  );
}
