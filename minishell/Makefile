# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/08/07 22:28:48 by mbastard          #+#    #+#              #
#    Updated: 2022/10/19 05:39:20 by mbastard         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

BIN				:=	bin/
NAME			:=	minishell
NAME_PATH		:=	$(addprefix $(BIN), $(NAME))
MAKEFLAGS		+=	--silent

SDIR			:=	src/
SRC				:=	$(shell find src -name "*.c")

ODIR			:=	obj/
OBJ				:=	$(subst $(SDIR),$(ODIR), ${SRC:.c=.o})

LFT_DIR			:=	libft/
LFT				:=	$(addprefix $(LFT_DIR)$(BIN), libft.a)

CC				:=	gcc
CFLG			:=	-Wall -Wextra -Werror
LFLG			:=	-lreadline -lncurses

$(ODIR)%.o		: $(SDIR)%.c
				mkdir -p $(subst $(SDIR),$(ODIR), $(shell dirname $<)/)
				$(CC) $(CFLG) -c $< -o ${addprefix $(ODIR), ${<:$(SDIR)%.c=%.o}}

${NAME_PATH}	: $(OBJ)
				mkdir -p $(BIN)
				cd $(LFT_DIR) && make all
				$(CC) $(OBJ) -o $(NAME_PATH) $(LFT) $(LFLG)

all				: $(NAME_PATH)

clean			:
				cd $(LFT_DIR) && make clean
				rm -rf $(ODIR)

fclean			: clean
				cd $(LFT_DIR) && make fclean
				rm -rf $(BIN)

re				: fclean all

test			:
				echo $(subst .o,, $(OBJ))

.PHONY			: all clean fclean re
