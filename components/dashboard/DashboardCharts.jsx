'use client';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

export function PromptGrowthChart({ data, COLORS }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPrompts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2}/>
            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
        <XAxis dataKey="name" stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 11}} axisLine={false} tickLine={false} />
        <YAxis stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 11}} axisLine={false} tickLine={false} />
        <RechartsTooltip contentStyle={{ backgroundColor: COLORS.surface, borderColor: COLORS.grid, borderRadius: '12px' }} />
        <Area type="monotone" dataKey="prompts" stroke={COLORS.primary} strokeWidth={3} fill="url(#colorPrompts)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TotalCopiesChart({ data, COLORS }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
        <XAxis dataKey="day" stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 11}} axisLine={false} tickLine={false} />
        <YAxis stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 11}} axisLine={false} tickLine={false} />
        <RechartsTooltip cursor={{fill: COLORS.grid, opacity: 0.1}} contentStyle={{ backgroundColor: COLORS.surface, borderColor: COLORS.grid, borderRadius: '12px' }} />
        <Bar dataKey="copies" fill={COLORS.secondary} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PlatformGrowthChart({ data, COLORS }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.25}/>
            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorPrompts2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.25}/>
            <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} opacity={0.5} />
        <XAxis dataKey="name" stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 11, fontWeight: 500}} axisLine={false} tickLine={false} dy={10} />
        <YAxis stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 11, fontWeight: 500}} axisLine={false} tickLine={false} dx={-10} />
        <RechartsTooltip 
          contentStyle={{ backgroundColor: COLORS.surface, borderColor: COLORS.grid, color: COLORS.text, borderRadius: '12px', padding: '12px 16px', fontSize: '13px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
          itemStyle={{ fontWeight: 'bold' }}
        />
        <Area type="monotone" dataKey="users" name="Users" stroke={COLORS.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
        <Area type="monotone" dataKey="prompts" name="Prompts" stroke={COLORS.secondary} strokeWidth={3} fillOpacity={1} fill="url(#colorPrompts2)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DensityVsCopiesChart({ data, COLORS }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data || []} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} opacity={0.3} />
        <XAxis dataKey="name" stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 10}} axisLine={false} tickLine={false} dy={5} />
        <YAxis yAxisId="left" stroke={COLORS.grid} tick={{fill: COLORS.grid, fontSize: 10}} axisLine={false} tickLine={false} dx={-5} />
        <RechartsTooltip 
          contentStyle={{ backgroundColor: COLORS.surface, borderColor: COLORS.grid, color: COLORS.text, borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
          itemStyle={{ fontWeight: 'bold' }}
          cursor={{ fill: COLORS.grid, opacity: 0.1 }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', marginTop: '5px' }} />
        <Bar yAxisId="left" dataKey="copies" name="Copies" fill="#06B6D4" radius={[4, 4, 0, 0]} barSize={20} />
        <Bar yAxisId="left" dataKey="prompts" name="Prompts" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DistributionShareChart({ data, COLORS, ENGINE_COLORS }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data || []}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={75}
          paddingAngle={4}
          dataKey="prompts"
          nameKey="name"
          stroke="none"
        >
          {(data || []).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={ENGINE_COLORS[entry.name] || ENGINE_COLORS['Other']} />
          ))}
        </Pie>
        <RechartsTooltip 
          contentStyle={{ backgroundColor: COLORS.surface, borderColor: COLORS.grid, color: COLORS.text, borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
          itemStyle={{ fontWeight: 'bold' }}
          formatter={(value) => [value, 'Prompts']}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          iconType="circle"
          wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }}
          formatter={(value, entry) => {
            const color = ENGINE_COLORS[value] || ENGINE_COLORS['Other'];
            return <span style={{ color }}>{value}</span>;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
