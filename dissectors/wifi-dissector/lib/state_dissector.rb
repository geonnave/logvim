require 'json'

class StateMachineizer
	class << self 
		attr_accessor :all_events, :color_events, :TAG, :title_color
	end

	def initialize
		@candidate_states = {}
		# initialize an empty array for each candidate state
		self.class.all_events.keys.each {|k| @candidate_states[k] = [] }

		@all_grabbed_states = []
		@all_recognized_states = []

		@color_codes = {
			:white => "#F0F0F0",
			:blue => "#6C8CF2",
			:yellow => "#F2E66C",
			:green => "#6FF26C",
			:red => "#F26C6C",
			:magenta => "#F58AF4",
			:cyan => "#7DE0ED"
		}
	end

	def parse_state line
		# [line.gsub(/([0-9]+\s+[0-9]{2}\-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}).*/, "\\1")]
		line.match(/([0-9]+)\s+/).captures
	end
	
	def append_state_when_matches state
		@candidate_states.each do |k, v|
			# identify if it is a known state, and save it
			if self.class.all_events[k][v.length] == state[1..-1]
				@candidate_states[k] << state 			
			else # discard a sub-sequence if has a mismatch
				@candidate_states[k].clear
			end
		end # :1 in this loop, only one event is likely to grow, because 
			#    sub-sequences are discarded as soon as there is a mismatch
	end

	def get_whole_event_if_any
		result = []
		@candidate_states.each do |k, v|
			# check if a whole known event was identified
			# comparing length is acceptable, because of comment :1
			if self.class.all_events[k].length == @candidate_states[k].length
				@all_recognized_states += @candidate_states[k]

				unrecognized_events = (@all_grabbed_states-@all_recognized_states)
				unless unrecognized_events.empty?
					result << ["#{self.class.TAG+"_no_info"}".to_sym,  unrecognized_events.dup]
					@all_recognized_states += unrecognized_events
				end # implementation is focused on 
					# *recognizing known events*,
					# which tends to discard *unrecognized events*; in this 
					# conditional we retrieve any unrecognized events

				r = []
				@candidate_states[k].each { |e| r << e.dup }
				result << [k, r]

				@candidate_states[k] = []
			end
		end
		result
	end

	def process line
		state = parse_state line

		# keep track of *every* state found
		@all_grabbed_states << state 

		append_state_when_matches state

		get_whole_event_if_any
	end

	def draw_event results, *args
		# results is one or more events
		results.each do |e|
			# e is an event, which is a title + a list of lines (labels)
			# e.g: ["title", [<label1>, <label2>, ...]]
			puts ({
				title: e[0],
				title_color: self.class.title_color,
				labels: e[1].map { |l| {id: l[0], label: l[1..-1].join(" ")} },
				color: @color_codes[self.class.color_events[e[0]]],
				source: "wifi_dissector"
			}.to_json)
			$stdout.flush
		end
	end

	def _draw_event results, *args
		results.each do |r| 
			k = r[0]
			print "#{args[0]}:#{k}: "
			puts
			r[1].each { |e| 
				# only colorize if printing to terminal
				#  (i.e not being piped to another program)
				if $stdout.tty?
					print "#{args[0]}#{e}\n".send(self.class.color_events[k])
				else
					print "#{args[0]}#{e}\n"
				end
			}
		end
		$stdout.flush
	end
	
end
