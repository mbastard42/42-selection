# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/07/24 04:01:57 by mbastard          #+#    #+#              #
#    Updated: 2022/11/23 06:47:25 by mbastard         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

BIN				:=	bin/
NAME			:=	libft.a
NAME_PATH		:=	$(addprefix $(BIN), $(NAME))
MAKEFLAGS		+=	--silent

SDIR			:=	src/
SRC				:=	$(shell find src -name "*.c")

ODIR			:=	obj/
OBJ				:=	$(subst $(SDIR),$(ODIR), ${SRC:.c=.o})

CC				:=	gcc
CFLAGS			:=	-Wall -Wextra -Werror

$(ODIR)%.o		: $(SDIR)%.c
				mkdir -p $(BIN)
				mkdir -p $(subst $(SDIR),$(ODIR), $(shell dirname $<)/)
				$(CC) $(CFLG) -c $< -o ${addprefix $(ODIR), ${<:$(SDIR)%.c=%.o}}
				ar rc $(NAME_PATH) ${addprefix $(ODIR), ${<:$(SDIR)%.c=%.o}}

${NAME_PATH}	: $(OBJ)
				ranlib $(NAME_PATH)

all				: $(NAME_PATH)

clean			:
				rm -rf $(ODIR)

fclean			: clean
				rm -rf $(BIN)

re				: clean all

.PHONY			: all clean fclean re
