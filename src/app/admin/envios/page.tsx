import { fetchCorreoArgentinoSettings } from '@/features/admin/shipping/queries/shipping-settings-queries'
import { ShippingSettingsForm } from '@/features/admin/shipping/components/shipping-settings-form'

export default async function AdminEnviosPage() {
  const settings = await fetchCorreoArgentinoSettings()

  return (
    <div className="p-6 lg:p-8">
      <ShippingSettingsForm settings={settings} />
    </div>
  )
}
